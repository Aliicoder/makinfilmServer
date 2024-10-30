import jwt from "jsonwebtoken";
import { Request , Response } from "express"
import { genAccessToken } from "./authentication";
import User from "../models/User";

export const refresh = async (req:Request,res:Response) =>{
  try {
    const refreshToken = req.cookies.refreshToken; console.log("refresh token >> ",req.cookies.refreshToken)
    if(!refreshToken)
      return res.status(401).json({error:"token is required"})
    jwt.verify(refreshToken,process?.env?.REFRESH_TOKEN_SECRET!,
      async (err:any,payload:any)=> {
        if(err){ console.log("refresh error >> ",err)
          return res.status(403).json({error:"Invalid refresh token"})
        } 
        if(!payload){ console.log("refresh payload >> ",payload)
          return res.status(403).json({error:"payload is required"})
        }
        const {id,email} = payload as { id:string , email : string}
        let user = await User.findOne({email})
        if(!user) 
          return res.status(404).json({error:"unauthorized access"}) 
        const accessToken = await genAccessToken({id:user._id,email:user.email,time:"1m"}); console.log(user)
        user = {
          name:user.name,
          accessToken
        } ; console.log("token refreshed :) ")
        return res.status(200).json({user,message:"welcome back"})
    })
  } catch (e:any) {
    return { statusCode : 500 , error : " something went wrong :\n"+e.message}
  }
}

export const cancelRefresh = async (req:Request,res:Response) =>{
  try {
    const refreshToken = req.cookies.refreshToken; console.log("refresh token >> ",req.cookies.refreshToken)
    if(!refreshToken)
      return res.status(401).json({error:"token is required"})
    jwt.verify(refreshToken,process?.env?.REFRESH_TOKEN_SECRET!,
      async (err:any,payload:any)=> {
        if(err){ console.log("refresh error >> ",err)
          return res.status(403).json({error:"Invalid refresh token"})
        } 
        if(!payload){ console.log("refresh payload >> ",payload)
          return res.status(403).json({error:"payload is required"})
        }
        const { id,email} = payload as { id:string , email : string}       
        let user = await User.findOne({email}) ; console.log("client logged out >>",user)
        if(!user){
          res.clearCookie("refreshToken",{httpOnly:true,sameSite:'none',secure:true})
          return res.status(404).json({message:"user to be logged not found"})
        }
        user.refreshToken = "";
        res.clearCookie("refreshToken",{httpOnly:true,sameSite:'none',secure:true})
        await user.save()
        user = {
          name:null,
          accessToken:null
        } ; ;console.log("logged out :) ")
        return res.status(200).json({user,message:"logged out"})
    })
  } catch (e:any) {
    return { statusCode : 500 , error : " something went wrong :\n"+e.message}
  }
}










