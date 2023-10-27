const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.js");

var checkUserAuth = async (req,res,next)=>{
    let token
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try {
            //  get token from header
            token =authorization.split(' ')[1]

            // verify token
            const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)
            console.log(userID)

            // get user from token

            req.user = await UserModel.findById(userID).select("-password")
            console.log(req.user._id)
            next()
            
        } catch (error) {
            console.log(error)
            res.status(401).send({"status":"failed","message":"Unauthorized user"})
            
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized user,no token"})
 
    }
}
module.exports = checkUserAuth

