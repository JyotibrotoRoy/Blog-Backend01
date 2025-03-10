import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";

export const canModifyPost = asyncHandler(async(req, res, next) => {
    try {
        const {PostId} = req.params;

        const post = await Post.findById(PostId)
        
        if(!post) {
            throw new ApiError(404, "Post not found")
        }

        if(post.author.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are Unauthorized to modify this post")
        }

        req.post = post
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Post was not found...Something went <wrong></wrong>")
    }
})