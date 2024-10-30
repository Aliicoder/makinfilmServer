import { Response } from "express-serve-static-core"
import { ExtendRequest } from "../middlewares/authentication"
import { loginDB } from "../services/userServices"
export interface login {
  email: string
  password: string
}
export const login = async (req:ExtendRequest, res:Response) => {
  const {email,password} = req.body
  const {statusCode,user,refreshToken,error} = await loginDB({email,password})
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.cookie("refreshToken",refreshToken,{
    expires: new Date(Date.now() + 30*24*60*60*1000) 
  })
  res.status(statusCode).json({user,message:"login successfully"})
}

