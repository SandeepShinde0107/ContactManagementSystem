const asyncHandler= require('express-async-handler');
const bcrypt= require("bcryptjs");
const User= require("../models/userModel");
const jwt= require("jsonwebtoken");
//  @desc for Register a user 
// @  get route /api/users/register
// @ access private

const registerUser=asyncHandler(async(req,res)=>{
    const {username, email, password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable= await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    // hash password
    const hashedPassword= await bcrypt.hash(password, 10);
    console.log("Hashed Password: ",hashedPassword);
    
    const user= await User.create({
        username,
        email,
        password:hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user.id, email:user.email});
    }else{
        res.status(400);
        throw new Error('user data is not valid');
    }
    // res.json({message: "Register the user"});
 });

 //  @desc for login a user 
// @  get route /api/users/login
// @ access private

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        req.status(400);
        throw new Error("All fields are mandatory");
    }
    const user= await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"15m"
        }
    );
    res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
    // res.json({message:"login the user"});
});


 //  @desc for current  user 
// @  get route /api/users/current
// @ access private

const currentUser=asyncHandler(async(req,res)=>{
    res.json(req.user);
});

 module.exports={registerUser, loginUser, currentUser};