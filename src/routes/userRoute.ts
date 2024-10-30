import express from 'express';
import { login } from '../controllers/userControllers';
import { auth } from '../middlewares/authentication';
const userRoute = express.Router();

userRoute.route('/login')
.all((req,res,next)=>{  console.log("user route") ; next();})
  .post(login)


export default userRoute