import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/ApiError.js"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"

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
    return res
    .status(200)
    .json(
        new ApiResponse(200, results, "Fetched all posts")
    )

})

export {
    createPost,
    getAllPost,

}