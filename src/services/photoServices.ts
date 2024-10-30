import cloudinary from "../utils/cloudinary"
import formidable from "formidable"
import Photo from "../models/Photo"
import { fetchPhotos } from "../controllers/photoControllers"

export const fetchPhotosDB = async ({search,curPage,perPage}:fetchPhotos) => {
  try{ console.log("curPage >> ", curPage)
    const query = search ? {description:{ $regex: new RegExp(search, 'i') }} : {} ; console.log("perPage >>" , perPage)
    const photosLen = await Photo.countDocuments(query);console.log("photosLen >>", photosLen)
    const pagesLen = Math.ceil(photosLen / perPage);console.log("pagesLen >>", pagesLen)
    const skip = ( curPage - 1 ) * perPage ; console.log("skip >>", skip)
    const photos = await Photo.find(query).skip(skip).limit(perPage)
    if(!photos)
      return { statusCode : 404, error:"no Photos found"}
    return { statusCode : 200, photos , pagesLen}
  }catch(error:any){ console.log(error)
    return { statusCode : 500 , error : " something went wrong "}
  }
}
interface addPhotoDB {
  arDescription:string
  enDescription:string
  imageFile:formidable.File
}
export const addPhotoDB = async ({arDescription,enDescription,imageFile}:addPhotoDB) => {
  try{
    let image , description;
    let imageResult = await cloudinary.v2.uploader.upload(imageFile.filepath,
      {
        folder:"makinImages",
        resource_type: "image",
      })
    if(!imageResult.public_id){
      return { statusCode : 401,error :"can't upload the image"};
    }
    image = {publicId:imageResult.public_id,url:imageResult.url}
    description = { ar:arDescription,en:enDescription }
    const uploadedPhoto = await Photo.create({image,description});console.log("photo >>",uploadedPhoto)
    if(!uploadedPhoto){
      await cloudinary.v2.uploader.destroy(uploadedPhoto.public_id)
      return { statusCode : 401,error :"can't save the photo"};
    }
    return { statusCode : 200, message:"photo uploaded"}
  }catch(error:any){
    console.log(error)
    return { statusCode : 500 , error : " something went wrong "}
  }
}