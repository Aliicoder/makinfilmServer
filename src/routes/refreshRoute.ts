import express from 'express';
import { auth } from '../middlewares/authentication';
import { refresh } from '../middlewares/refreshes';
const refreshRoute = express.Router();

refreshRoute.route('/')
.all((req,res,next)=>{  console.log("refresh route") ; next();})
  .get(refresh)


export default refreshRoute