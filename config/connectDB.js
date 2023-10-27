const mongoose =require("mongoose");

const connectDB = async (DATABASE_URL) =>{
    try {
       const DB_OPTIONS={
        dbName: "chatDB"
       } 
       await mongoose.connect(DATABASE_URL,DB_OPTIONS)
       console.log("connected successfully...")
    } catch (error) {
        console.log(error)
        
    }
}
module.exports= connectDB;