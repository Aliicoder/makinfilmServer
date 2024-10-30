import express from 'express';
import { auth } from '../middlewares/authentication';
import { addVideo, editVideo, fetchVideos } from '../controllers/videoControllers';
const videoRoute = express.Router();

videoRoute.route('/').all((req,res,next)=>{  console.log("user route") ; next();})
  .get(fetchVideos)
  .post(auth,addVideo)
  .patch(auth,editVideo)
videoRoute.route('/:videoId').all((req,res,next)=>{  console.log("user route") ; next();})
  .patch(auth,editVideo)


export default videoRoute