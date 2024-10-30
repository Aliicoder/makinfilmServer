import mongoose from 'mongoose';
export const connectToDatabase = async () =>{
  try{
    await mongoose.connect(`${process.env.CONNECTION_URL}`)
    console.log(">> Connected to database");
  }catch(err){
    console.log(err);
  }
}
