import {Schema,Document,models,model} from "mongoose";
import validator from "validator"
export interface IPhoto extends Document  {
  image:{
    publicId: string;
    url: string;
  }
  description:{
    ar: string;
    en: string;
  }
}
const photoSchema = new Schema<IPhoto>({
  image:{
    publicId:{type:String,required:true},
    url:{type:String,required:true}
  },
  description:{
    ar:{type:String, required:true},
    en:{type:String, required:true}
  }
},{
   timestamps: true
})

const Photo = models.Photo || model<IPhoto>('Photo',photoSchema);

export default Photo