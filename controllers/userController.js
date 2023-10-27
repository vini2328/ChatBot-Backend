const UserModel = require('../model/user.js');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

class UserController {
    static userRegistration =async (req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body
        const user= await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"email already exsist"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    try {

                        const salt =await bcrypt.genSalt(12)
                        const hashpassword= await bcrypt.hash(password,salt)
                        const doc= new UserModel({
                            name: name,
                            email:email,
                            password:hashpassword,
                            tc:tc,
                        })
                        await doc.save()
                        const saved_user =await UserModel.findOne({email:email})

                        // generate JWT token
                        const token =JWT.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:"4d"})
                        res.status(201).send({"status":"Success","message":"User Register Successfully", "token":token})


    
                        
                    } catch (error) {
                        console.log(error)
                        res.send({"status":"failed","message":"Unable to register"})

                    }

                }else{
                    res.send({"status":"failed","message":"password and confirm password dosent match"})


                }

            }else{
                res.send({"status":"failed","message":"all fields are required"})
            }
            
        }
    }

    static userLogin = async (req,res) =>{
        try {
            const {email,password}=req.body
            console.log('check ',email,password)
            if(email && password){
                const user= await UserModel.findOne({email:email})
            if (user !=null){
                const isMatch =await bcrypt.compare(password,user.password)
                if((user.email === email) && isMatch){

                    // generate JWT token
                    const token =JWT.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"4d"})

                    res.send({"status":"Success","message":"Login Success","token":token , "name":user.name})


                }else{
                    res.send({"status":"failed","message":"Email and password is not valid"})
 
                }


            }else{
            res.send({"status":"failed","message":"you are not a regsitered user"})


            }
        } 
        } catch (error) {
            res.send({"status":"failed","message":"Unable to Login"})

            
        }
    }

    static changeUserPassword = async (req,res)=>{
        const {password,password_confirmation}=req.body
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed","message":"New password and confirm password doesnt match"})


            }else{
                const salt =await bcrypt.genSalt(12)
                const newhashpassword= await bcrypt.hash(password,salt)
                await UserModel.findByIdAndUpdate(req.user._id, {$set:{password:newhashpassword}})
                res.send({"status":"Success","message":"password changed succesfully"})



            }

        }else{
            res.send({"status":"failed","message":"all fields are required"})
        }
    } 

    static Loggeduser = async (req,res)=>{
        res.send({"user":req.user})
    }

    static sendUserPasswordResetEmail =async(req,res)=>{
        const {email} = req.body
        try {
            if (email){
                const user= await UserModel.findOne({email:email})
                if(user){
                    const secret = user._id +process.env.JWT_SECRET_KEY
    
                    const token =JWT.sign({userID :user._id},secret,{expiresIn:"15m"})
                    const link = `http://localhost:3000/confirmpassword/${user._id}/${token}`
                    console.log(link)
    
                    // send email
                    let testAccount = await nodemailer.createTestAccount()

                    
                    let transporter =nodemailer.createTransport({
                        host:process.env.EMAIL_HOST,
                        port:process.env.EMAIL_PORT,
                        secure: false,
                        auth:{
                            user:testAccount.user,
                            pass:testAccount.pass,
                            // check
                        },
                        


                    })
                    let info =await transporter.sendMail({
                        from :process.env.EMAIL_FROM,
                        to: user.email,
                        subject :"Chatbot password reset link",
                        html: `<a href=${link}>Click Here</a> to reset your password`
                    })

                    console.log('infppp',info)
                    res.send({"status":"success","message":"password reset email sent...please check your email","info":nodemailer.getTestMessageUrl(info)})
    
    
                }else{
                    res.send({"status":"failed","message":"Email dosent exsist"})
    
                }
    
    
            }else{
                res.send({"status":"failed","message":"all fields are required"})
    
            }
    
        } catch (error) {
         console.log('erorr',error)
         res.send('err',error)   
        }
               
    }

    static userPasswordReset =async (req,res)=>{
        const {password,password_confirmation}=req.body
        const {id, token}=req.params
        const user =await UserModel.findById(id)
        const new_secret =user._id + process.env.JWT_SECRET_KEY

        console.log('idddd',id,'tokennn',token)

        try {
            JWT.verify(token,new_secret)
            if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status":"failed","message":"New password and confirm password doesnt match"})


                }else{
                    const salt =await bcrypt.genSalt(12)
                    const newhashpassword= await bcrypt.hash(password,salt)
                    await UserModel.findByIdAndUpdate(user._id, {$set:{password:newhashpassword}})
                    res.send({"status":"Success","message":"password reset succesfully"})
        
    

                }

            }else{
                res.send({"status":"failed","message":"all fields are required"})
 
            }
            
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"all fields are required"})



            
        }
    }
}
module.exports= UserController;