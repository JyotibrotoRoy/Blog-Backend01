import { Router } from "express";
import {
    createPost,
    getAllPost,
    getPost,
    updatePost,
    deletePost
} from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { canModifyPost } from "../middlewares/canModifyPost.middleware";

const router = Router()

router.route("/createPost").post(verifyJWT, canModifyPost, createPost)
router.route("/getAllPost").get(verifyJWT, getAllPost)
router.route("/getPost").get(verifyJWT, getPost)
router.route("/updatePost").patch(verifyJWT, updatePost)
router.route("/deletePost").delete(verifyJWT, canModifyPost, deletePost)

export default router