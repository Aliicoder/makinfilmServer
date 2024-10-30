import {Schema,Document,models,model} from "mongoose";
import validator from "validator"
export interface IUser extends Document  {
  name: string
  email: string
  password: string
  refreshToken: string
  method:string
  passwordResetToken: string
  passwordResetTokenExpiration: Date
}
const userSchema = new Schema<IUser>({
  name:{type: String , trim:true ,required: true},
  email:{type: String,unique: true ,required: true ,validate:[validator.isEmail]},
  password:{type: String, trim:true ,required: true,select:false},
  method:{type: String, trim:true ,required:true ,default:"manual"},
  refreshToken:{type: String, trim:true},
  passwordResetToken:{select:false,type:String,default:null},
  passwordResetTokenExpiration:{type:Date, default:null}
},{
   timestamps: true
})

const User = models.User || model<IUser>('User',userSchema);

export default User