import User from "../models/UserSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signup = async(req,res) =>{
       const {name,email,mobile,password} = req.body

       //validate data
       if([name,email,mobile,password].some((data)=>String(data).trim()==="")){
        return res.status(400).json({message : "Please fill all the details"})
       }

       //check if user already exists 
       const userexists = await User.findOne({email})

       if(userexists){
        return res.status(400).json({message : "User already exists"})
       }

       const hashpassword = await bcrypt.hash(password,10)

       const newUser = new User({name,email,mobile,password : hashpassword})
       await newUser.save()

       res.status(201).json({message : "User Created Successfully",user:newUser})
}

export const login = async(req,res)=>{
    const {email,password} = req.body

    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' })
    }

    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({ message: 'User not found!!' })
    }

    
    const ismatch = await bcrypt.compare(password,user.password)

    if(!ismatch){
        return res.status(400).json({ message: 'Invalid credentials!!' })
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email }, 
        process.env.JWT_KEY, 
        { expiresIn: '12h' } 
      );

    res.status(200).json(
        {
            message: 'Login successful',
            token,
            username : user.name

        }
    )
}