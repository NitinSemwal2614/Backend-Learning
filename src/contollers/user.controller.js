import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req,res) => {
    // get user details from frontend 
    // validation of data - not empty
    //  Check if user already exits by checking username and email
    //  check for images , check for avatar
    //  upload them to cloudinary , avatar
    // Create user object - create entry in DB
    // Remove Password and Refresh token field from response 
    // Check for user creation
    //  Return Yes !! 


    // USER DETAILS
    const {fullName , email ,username , password} = req.body 
    console.log("email :" , email);


/*  ----NOOB WALA TARIKA ----
    if( fullName === ""){
        throw new ApiError (400 , "Fullname is required")
    }
*/

// VALIDATION OF DETAILS
if(
    [fullName , email, username , password].some((field) => 
    field?.trim() === "")
){
    throw new ApiError (400 , "All Fields are Required")
}

//  CHECKING IF THE USER ALREADY EXISTS IN DATABASE
const existedUser = User.findOne({
    $or:[{email}, {username}]
})

if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
}

// Avatar and Image Check 
const avatarLocalPath = req.files?.avatar[0]?.path ;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError (400 , "Avatar file is Required")
}

// Now  we will save the data to database 
const avatar = await uploadOnCloudinary (avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError (400 , "Avatar file is Required")
}

username.create({
    fullName,
    avatar:avatar.url,
    coverImage : coverImage ?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

//  Sending Response  To The Client Side 
if(!createdUser){
    throw new ApiError (500 , "Something went wrong while registering the user")
}
//   Returning a success response 
return res.status(201).json(
    new ApiResponse(200, createdUser , "User has been registered Successfull")
)

})

export {
    registerUser
};
