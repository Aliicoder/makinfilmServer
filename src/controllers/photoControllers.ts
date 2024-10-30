import { Response } from "express-serve-static-core"
import { ExtendRequest } from "../middlewares/authentication"
import formidable from "formidable"
import { addPhotoDB, fetchPhotosDB } from "../services/photoServices"
export interface fetchPhotos {
  search: string | ""
  curPage: number | 1
  perPage: number | 8
}
export const fetchPhotos = async (req:ExtendRequest, res:Response) => {
  const { search ,curPage ,perPage } = req.query as unknown as fetchPhotos
  const {statusCode,photos ,pagesLen,error} = await fetchPhotosDB({ search ,curPage ,perPage })
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.status(statusCode).json({photos,pagesLen,message:"photos fetched"})
}
export const addPhoto = async (req:ExtendRequest, res:Response) => {
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
  let arDescription = fields.arDescription as string[] | string | undefined 
  let enDescription = fields.enDescription as string[] | string | undefined 
  let image = files.image as formidable.File[]  | undefined 
  if( !enDescription || !arDescription  || !image)
    return res.status(401).json({message:"Missing required fields"})  
  arDescription = arDescription[0]
  enDescription = enDescription[0] 
  let imageFile = image[0] 
  const {statusCode,message,error} = await addPhotoDB({arDescription,enDescription,imageFile})
  if(statusCode.toString().startsWith("4") || statusCode.toString().startsWith("5"))
    return res.status(statusCode).json({message:error})
  res.status(statusCode).json({message})
}
