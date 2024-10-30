import jwt from "jsonwebtoken"
import { Request , Response , NextFunction} from "express"
import User from "../models/User"
export interface ExtendRequest extends Request {
  user? : any
}
interface TokenProps {
  id: string
  email: string
  time:string
}
export const genAccessToken= ({id,email,time}:TokenProps)=>{
  const accessToken:string = jwt.sign({id,email},process?.env?.ACCESS_TOKEN_SECRET!,{
    expiresIn:time
  })
  return accessToken
}
export const genRefreshToken= ({id,email,time}:TokenProps)=>{
  const accessToken:string = jwt.sign({id,email},process?.env?.REFRESH_TOKEN_SECRET!,{
    expiresIn:time
  })
  return accessToken
}

export const auth = (req:ExtendRequest,res:Response,next:NextFunction) =>{
  console.log("authentication")
  try {
    const AuthorizationHeader = req.headers["authorization"] ; console.log("AuthorizationHeader >>",AuthorizationHeader)
    const startsWithBearer = AuthorizationHeader?.startsWith("Bearer")
    if(!startsWithBearer)
      return res.status(403).json({message:"token must start with Bearer"})
    const token = AuthorizationHeader?.split(' ')[1] 
    if (!token)
      return res.status(403).json({message:"token is required"})
    jwt.verify(token,process?.env?.ACCESS_TOKEN_SECRET!, async (error,payload) =>{
      if(error){ console.log("authentication error >>",error);
        return res.status(403).json({message:"token not valid"})
      }
      if(!payload)
        return res.status(403).json({message:"token does not have payload"})
      const {id,email} = payload as {id : string,email:string}
      const user  = await User.findOne({email})
      if(!user)
        return res.status(404).json({message:"user not found"})
      console.log(">> seller authenticated")
      req.user = user
      next()
    })  
  }catch(e:any){
    res.status(500).send("something went wrong:\n"+e.message)
  }
}
