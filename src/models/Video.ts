import {Schema,Document,models,model} from "mongoose";
import validator from "validator"
export interface IVideo extends Document  {
  image:{
    publicId: string;
    url: string;
  }
  video:{
    publicId: string;
    url:string;
  }
  title:{
    ar: string;
    en: string;
  },
  description:{
    ar: string;
    en: string;
  }
}
const videoSchema = new Schema<IVideo>({
  image:{
    publicId:{type:String,required:true},
    url:{type:String,required:true}
  },
  video:{
    publicId:{type:String,required:true},
    url:{type:String,required:true}
  },
  title:{
    ar:{type:String, required:true},
    en:{type:String, required:true}
  },
  description:{
    ar:{type:String, required:true},
    en:{type:String, required:true}
  }
},{
   timestamps: true
})

const Video = models.Video || model<IVideo>('Video',videoSchema);

export default Video