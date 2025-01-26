import express from "express";
import asynchandler from "../utils/asynchandler.js"
import {signup,login,updateProfile,deleteAccount} from "../controller/AuthController.js"
import verifyToken from "../middlewares/Verify.js";

const router = express.Router();

router.post('/signup',asynchandler(signup))
router.post('/login',asynchandler(login))
router.put('/updateprofile', verifyToken, asynchandler(updateProfile))
router.delete('/deleteaccount', verifyToken, asynchandler(deleteAccount))

export default router