import express from "express";
import asynchandler from "../utils/asynchandler.js"
import {signup,login} from "../controller/AuthController.js"

const router = express.Router();

router.post('/signup',asynchandler(signup))
router.post('/login',asynchandler(login))

export default router