import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://shidiqfzr:Shubuh28Mei2003@cluster0.oam7onx.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}