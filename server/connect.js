import mongoose from "mongoose";
mongoose.set('strictQuery', true)
const url ='mongodb://127.0.0.1:27017/Booking'
mongoose.connect(url).then(()=>{
    console.log("Connected.....")
})
