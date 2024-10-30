import bcrypt from 'bcrypt'
import { genRefreshToken, genAccessToken } from "../middlewares/authentication"
import { login } from '../controllers/userControllers'
import User, { IUser } from '../models/User';
interface loginDB extends login   {}
export const loginDB = async ({email, password}:loginDB)=>{
  try {
    let user = await User.findOne({email}).select("+password") ; 
    if(!user)
      return { statusCode : 404, error : "unauthorized access" }
    const isValidPassword = await bcrypt.compare(password,user.password)
    if(!isValidPassword)
      return { statusCode : 403, error : "invalid credentials"}
    const accessToken = await genAccessToken({id:user._id,email:user.email,time:"1m"})
    const refreshToken = await genRefreshToken({id:user._id,email:user.email,time:"30d"})
    user.refreshToken = refreshToken
    await user.save()
    user = {
      name:user.name,
      email:user.email,
      accessToken,
    }
    return { statusCode : 200, user , refreshToken }
  } catch (error) {
    console.error(error)
    return { statusCode : 500 , error : "something went wrong" }
  }
}
