import joi from "joi"
import bcrypt from "bcrypt"
import userModal from "../models/userModel.js";
import genAuthToken from "../utils/genAuthToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const regusterUser = async (req,res) => {
    const { name, email, password } = req.body;

    //VALIDATION
    const schema = joi.object({
        name: joi.string().min(3).max(40).required(),
        email: joi.string().min(5).max(40).required().email(),
        password: joi.string().min(5).max(40).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

   
    try {
         //CHECK USER EXIST
        const isExistUser = await userModal.findOne({ email: email });
        if (isExistUser) return res.status(400).json({ message: "User Already exist" });

        const hasePassword = await bcrypt.hash(password, 10);

        //email validation 
        const userToken = jwt.sign({ email: email }, process.env.SECRET, { expiresIn: "10m" });
       
        const link = `https://ntacky-node.onrender.com/api/auth/verify/${userToken}`

        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
        });

        const mailOption = {
            from: process.env.EMAIL, 
            to: email,
            subject: "Varifed your email",
                html: `
               <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    .link{
                        background-color: blue;
                        color: white;
                        padding: 15px 30px;
                        border: none;
                        border-radious:16px;
                    }
                </style>
            </head>
            <body>
                <h1>varified email address</h1>
                <a href=${link} class="link">varefied Link here</a>
            </body>
            </html>`
        }

        transport.sendMail(mailOption, (error, data) => {
            if (error) {
                res.status(400).json({message:"error"})
            } else {
                res.status(200).json({message:"email send successfull"})
            }
        })
        


        const createUser = new userModal({
            name,
            email,
            password:hasePassword
        });
        const result = await createUser.save();
        const token = genAuthToken(result);

        res.status(200).json({ result, token });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const emailVarefide = async (req, res) => {
    const { token } = req.params;
    try {
        if (token) {
            const isVarefide = jwt.verify(token,process.env.SECRET);

            if (isVarefide) {
                const getUser = await userModal.findOne({ email: isVarefide.email });
                const saveUser = await userModal.findOneAndUpdate({ _id: getUser._id }, { isVarefide: true });
                res.status(200).json({ message: "Email varefication successfull" });
            } else {
                res.status(400).json({message:"Link expair"})
            }
            
        } else {
            res.status(400).json({message:"invalide Url"});
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const schema = joi.object({
        email: joi.string().min(3).max(40).required().email(),
        password: joi.string().min(5).max(40).required()
    });

    //CHECK VALIDATE USER
    const { error } = schema.validate(req.body);
    if (error) res.status(400).json({ message: error.details[0].message })
    
   try {
       const isExistUser = await userModal.findOne({ email: email });
       if (isExistUser.isVarefide) {
        if (!isExistUser) return res.status(400).json({ message: "User Not Found" });

        //MATCH PASSWORD
        const checkPassword =await bcrypt.compare(password, isExistUser.password);
        if (!checkPassword) return res.status(400).json({ message: "Password not match" });
 
        const token = genAuthToken(isExistUser);
        res.status(200).json({ result: isExistUser, token });
 
       } else {
           res.status(400).json({message:"Plese Varefie your email and login"})
       }
      

   } catch (error) {
       res.status(400).json({ message: "something went wrong" });
   } 
}

export const forgetPasswordEmailVarefecation = async (req, res) => {
    const { email } = req.body;
    try {
        if (email) {
            const foundUser = await userModal.findOne({ email: email });
        if (foundUser) {
            const token = jwt.sign({ email: foundUser.email }, process.env.SECRET, { expiresIn: "10m" });
            const link = `https://stacky-node.netlify.app/changepassword/${foundUser._id}/${token}`
            const transport = nodemailer.createTransport({
                service:"gmail",
                host: "smtp.example.com",
                port: 587,
                auth: {
                  user:process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Reseat your passwrod",
                html: `
               <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    .link{
                        background-color: blue;
                        color: white;
                        padding: 15px 30px;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <h1>varified email address</h1>
                <a href=${link} class="link">varefied forget password link</a>
            </body>
            </html>`
                
            }

            transport.sendMail(mailOptions, (error, data) => {
                if (error) {
                    res.status(400).json({message:"error"})
                } else {
                    res.status(200).json({ message: "email send successfully" });
                }
                
            })
           

        } else {
            res.status(400).json({ message: "User not found" });
        }
        
        } else {
            res.status(400).json({message:"Email is required"})
        }
    } catch (error) {
            res.status(400).json({message:error.message})
    }
}

export const forgetPassword = async (req,res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        if (password && confirmPassword && id && token) {
            if (password === confirmPassword) {
                const tokenVarefie = jwt.verify(token, process.env.SECRET);
                if (tokenVarefie) {
                    const findUser = await userModal.findById({ _id: id });
                    const hase = await bcrypt.hash(password, 10);
                    await userModal.findOneAndUpdate({ _id: findUser._id }, { password: hase });
                    res.status(200).json({ message: "Password update successfull" });
                } else {
                    res.status(400).json({message:"Link expair"})
                }
            } else {
                res.status(400).json({ message: "Password and Confirm Password are not same" });
            }
            
        } else {
            res.status(400).json({ message: "All feild are require" });
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}