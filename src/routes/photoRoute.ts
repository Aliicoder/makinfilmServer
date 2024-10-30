import express from 'express';
import { auth } from '../middlewares/authentication';
import { addPhoto, fetchPhotos } from '../controllers/photoControllers';
const photoRoute = express.Router();

photoRoute.route('/').all((req,res,next)=>{  console.log("user route") ; next();})
  .get(fetchPhotos)
  .post(auth,addPhoto)


export default photoRoute