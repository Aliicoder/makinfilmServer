import { Response } from "express-serve-static-core"
import { ExtendRequest } from "../middlewares/authentication"
import formidable from "formidable"
import { addVideoDB, editVideoDB, fetchVideosDB } from "../services/videoServices"
export interface fetchVideos {
  search: string | ""
  curPage: number | 1
  perPage: number | 8
}
export const fetchVideos = async (req:ExtendRequest, res:Response) => {
  const { search ,curPage ,perPage } = req.query as unknown as fetchVideos
  const {statusCode,pagesLen,videos,error} = await fetchVideosDB({ search ,curPage ,perPage })
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.status(statusCode).json({videos,pagesLen,message:"videos fetched"})
}
export const addVideo = async (req:ExtendRequest, res:Response) => {
  const form = formidable()
  const promisifyParse = (): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve) =>{
      form.parse(req, async (error,fields,files)=>{
        if(error) 
          return res.status(401).json({message:"Invalid form submission"})
        return resolve({fields,files})
      })
    })
  }
  const { fields,files } = await promisifyParse();
  let arTitle = fields.arTitle as string[] | string | undefined 
  let enTitle = fields.enTitle as string[] | string | undefined 
  let arDescription = fields.arDescription as string[] | string | undefined 
  let enDescription = fields.enDescription as string[] | string | undefined 
  let image = files.image as formidable.File[]  | undefined 
  let video = files.video as formidable.File[]  | undefined 
  if( !arTitle || !enTitle || !enDescription || !arDescription || !video || !image)
    return res.status(401).json({message:"Missing required fields"})  
  arTitle = arTitle[0] 
  enTitle = enTitle[0] 
  arDescription = arDescription[0]
  enDescription = enDescription[0] 
  let videoFile = video[0] 
  let imageFile = image[0] 
  const {statusCode,message,error} = await addVideoDB({arTitle,enTitle,arDescription,enDescription,videoFile,imageFile})
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.status(statusCode).json({message})
}

export const editVideo = async (req:ExtendRequest, res:Response) => {
  const { videoId } = req.params
  const form = formidable()
  const promisifyParse = (): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve) =>{
      form.parse(req, async (error,fields,files)=>{
        if(error) 
          return res.status(401).json({message:"Invalid form submission"})
        return resolve({fields,files})
      })
    })
  }
  const { fields,files } = await promisifyParse(); console.log("")
  let arTitle = fields.arTitle as string[] | string | undefined 
  let enTitle = fields.enTitle as string[] | string | undefined 
  let arDescription = fields.arDescription as string[] | string | undefined 
  let enDescription = fields.enDescription as string[] | string | undefined 
  let image = files.image as formidable.File[]  | undefined 
  let video = files.video as formidable.File[]  | undefined 
  if( !arTitle || !enTitle || !enDescription || !arDescription) 
    return res.status(401).json({message:"Missing required fields"})  
  arTitle = arTitle[0] 
  enTitle = enTitle[0] 
  arDescription = arDescription[0]
  enDescription = enDescription[0] 
  let videoFile = video ? video[0] : undefined  
  let imageFile = image ? image[0] : undefined
  const {statusCode,message,error} = await editVideoDB({videoId,arTitle,enTitle,arDescription,enDescription,videoFile,imageFile})
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.status(statusCode).json({message})
}
