import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/ApiError.js"
import {Like} from "../models/like.model.js"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"
import NodeCache from "node-cache"

const cache = new NodeCache()

const likePost = asyncHandler(async(req, res) => {
    const {postID} = req.params
    const userID = req.user.id;
    if(!postID) {
        throw new ApiError(400, "Post ID not found")
    }

    const existingLike = await Like.findOne({post: postID, user: userID})
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        cache.del(`likes_${postID}`)
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Post unliked"))
    }

    const like = await Like.create({post: postID, user: userID})

    const likeCount = await Like.countDocuments({post: postID})

    return res
    .status(201)
    .json(new ApiResponse(201, {likeCount}, "Post liked successfully"))

})