import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/ApiError.js"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"
import NodeCache from "node-cache"
const cache = new NodeCache()

const createPost = asyncHandler(async(req, res) => {
    const {title, content} = req.body

    if(
        [title, content].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(401, "All fields are required")
    }

    const owner = req.user._id

    const post = await Post.create(
        {
            title,
            content,
            author: owner
        }
    )

    cache.set(Post._id.toString(), post, 600)

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "Post created successfully")
    )

})

const getAllPost = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const startIndex = (page - 1) * limit
    const endIndex = (page * limit )

    const cacheKey = `posts_page_${page}_limit_${limit}`

    let cachedData = cache.get(cacheKey)
    if(cachedData) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, results, "Fetched all posts")
            )
    }

    const results = {}
    const totalDocuments = await Post.countDocuments();

    if(startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    if(endIndex < totalDocuments) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    results.currentPage = page
    results.posts = await Post.find().limit(limit).skip(startIndex)

    cache.set(cacheKey, results, 600)

    return res
    .status(200)
    .json(
        new ApiResponse(200, results, "Fetched all posts")
    )

})

const getPost = asyncHandler(async(req, res) => {
    const ID = req.query.ID

    if(!ID) {
        throw new ApiError(401, "Post ID is not valid")
    }

    let post = cache.get(ID)
    if(post) {
        return res
        .status(200)
        .json(200, post, "Post fetched successfully")
    }

    post = await Post.findById(ID)
    if(!post) {
        throw new ApiError(401, "Couldn't find post")
    }
    
    cache.set(ID, post, 600)

    return res
    .status(200)
    .json(200, post, "Post fetched successfully")
})

const updatePost = asyncHandler(async(req, res) => {
    const updatedData = req.body
    const {id} = req.params
    if(!updatedData || Object.keys(updatedData).length === 0) {
        throw new ApiError(400, "data is empty")
    }
    if(!id) {
        throw new ApiError(400, "Couldn't find post id")
    }
    const post = await Post.findByIdAndUpdate(id, updatedData, {new:true})
    
    if(!post) {
        throw new ApiError( 400, "Post not found")
    }

    cache.del(id)
    cache.set(id, updatedData, 600)

    return res
    .status(200)
    .json(200, post, "post updated successfully")
})

const deletePost = asyncHandler(async(req, res) => {
    const {id} = req.params
    
    if(!id) {
        throw new ApiError(400, "Post ID is required")
    }

    const post = await Post.findByIdAndDelete(id)

    if(!post) {
        throw new ApiError(404, "Post not found")
    }

    cache.del(id)

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Post deleted succesfully")
    )
})

export {
    createPost,
    getAllPost,
    getPost,
    updatePost,
    deletePost
}