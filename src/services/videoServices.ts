import { ObjectId } from "mongoose"
import cloudinary from "../utils/cloudinary"
import formidable from "formidable"
import Video from "../models/Video"
import { fetchVideos } from "../controllers/videoControllers"

export const fetchVideosDB = async ({search,curPage,perPage}:fetchVideos) => {
  try{ console.log("curPage >>" , curPage); console.log("search >>" , search);
    const query = search ? {"description.en":{ $regex: new RegExp(search, 'i') }} : {} ; console.log("perPage >>" , perPage)
    const videosLen = await Video.countDocuments(query); console.log("photosLen >>", videosLen);console.log("query >>" , query)
    const pagesLen = Math.ceil(videosLen / perPage);console.log("pagesLen >>", pagesLen)
    const skip = ( curPage - 1 ) * perPage ; console.log("skip >>", skip)
    const videos = await Video.find(query).skip(skip).limit(perPage)
    if(!videos)
      return { statusCode : 404, error:"no Photos found"}
    return { statusCode : 200, videos , pagesLen}
  }catch(error:any){ console.log(error)
    return { statusCode : 500 , error : " something went wrong "}
  }
}
interface AddVideoDB {
  arTitle:string
  enTitle:string
  arDescription:string
  enDescription:string
  videoFile:formidable.File
  imageFile:formidable.File
}
export const addVideoDB = async ({arTitle,enTitle,arDescription,enDescription,videoFile,imageFile}:AddVideoDB) => {
  try{ console.log("AddVideoDB")
    let image , video ,title, description;
    const videoResult:any = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_large(
        videoFile.filepath,
        {
          folder: "makinVideos",
          resource_type: "video",
          chunk_size: 6000000, 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    if(!videoResult.public_id)
      return { statusCode : 401,error :"can't upload the video" };
    let imageResult = await cloudinary.v2.uploader.upload(imageFile.filepath,
      {
        folder:"makinImages",
        resource_type: "image",
      })
    if(!imageResult.public_id){
      await cloudinary.v2.uploader.destroy(videoResult.public_id)
      return { statusCode : 401,error :"can't upload the image"};
    }
    image = {publicId:imageResult.public_id,url:imageResult.url}
    video = {publicId:videoResult.public_id,url:videoResult.url}
    title = { ar:arTitle,en:enTitle }
    description = { ar:arDescription,en:enDescription }
    const uploadedVideo = await Video.create({image,video,title,description});console.log("video >>",video)
    if(!uploadedVideo){
      await cloudinary.v2.uploader.destroy(videoResult.public_id)
      await cloudinary.v2.uploader.destroy(imageResult.public_id)
      return { statusCode : 401,error :"can't save the video"};
    }
    return { statusCode : 200, message:"video uploaded"}
  }catch(error:any){
    console.log(error)
    return { statusCode : 500 , error : " something went wrong "}
  }
}

interface editVideoDB {
  videoId:string
  arTitle:string
  enTitle:string
  arDescription:string
  enDescription:string
  videoFile?:formidable.File | undefined
  imageFile?:formidable.File | undefined
}
export const editVideoDB = async ({videoId,arTitle,enTitle,arDescription,enDescription,videoFile,imageFile}:editVideoDB) => {
  try{
    let videoResult:any,imageResult
    let updatedVideo = await Video.findById({_id:videoId})
    if(!updatedVideo)
      return { statusCode : 401,error :"can't find the video"};
    if(videoFile){
      await cloudinary.v2.uploader.destroy(updatedVideo.video.publicId)
      videoResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_large(
          videoFile.filepath,
          {
            folder: "makinVideos",
            resource_type: "video",
            chunk_size: 6000000, 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
      if(!videoResult.public_id)
        return { statusCode : 401,error :"can't upload the video" };
      updatedVideo.video = {publicId:videoResult.public_id,url:videoResult.url}
    }
    if(imageFile){
      await cloudinary.v2.uploader.destroy(updatedVideo.image.publicId)
      imageResult = await cloudinary.v2.uploader.upload(imageFile.filepath,
        {
          folder:"makinImages",
          resource_type: "image",
        })
      if(!imageResult.public_id){
        if(videoResult.public_id)
          await cloudinary.v2.uploader.destroy(videoResult.public_id)
        return { statusCode : 401,error :"can't upload the image"};
      }
      updatedVideo.image = {publicId:imageResult.public_id,url:imageResult.url}
    }
    updatedVideo.title = { ar:arTitle,en:enTitle }
    updatedVideo.description = { ar:arDescription,en:enDescription }
    await updatedVideo.save()
    return { statusCode : 200, message:"video uploaded"}
  }catch(error:any){
    console.log(error)
    return { statusCode : 500 , error : " something went wrong "}
  }
}