import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        liked: {
            type: Boolean,
            default: true
        }
    },{timestamps: true}
)

export const Like = mongoose.model("like", likeSchema)