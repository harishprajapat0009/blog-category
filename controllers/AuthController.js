const AdminModel = require('../models/AdminModel');

const nodemailer = require("nodemailer");


// Sign In
module.exports.signIn = async (req, res) => {
    try{
            res.render('Authentication/SignIn');
    }
    catch(err){
        console.log(err);
    }
};

module.exports.signInCheck = async (req, res) => {
    try{
        req.flash('success', "Login Successfully")
        return res.redirect('/dashboard');
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
};

// Forgot Password And Set New Password
module.exports.verifyEmail = async (req, res) => {
    try{
        let emailVerify = await AdminModel.find({email : req.body.email}).countDocuments();
        if(emailVerify == 1){
            let getData = await AdminModel.findOne({email : req.body.email});
            let OTP = Math.floor(Math.random()*1000000);


            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "prajapat2023harish@gmail.com",
                  pass: "jnfnvscflnokqkwa",
                },
                tls: {
                    rejectUnauthorized : false
                }
              });

              const info = await transporter.sendMail({
                from: "prajapat2023harish@gmail.com", // sender address
                to: getData.email, // list of receivers
                subject: "OTP Verification", // Subject line
                html: `<b>Your OTP is here: ${OTP}</b>`, // html body
              });
            
            console.log("OTP send successfully");

            res.cookie('email', getData.email)
            res.cookie('OTP', OTP)
            
            return res.redirect('/checkOtp')
        }
    }
    catch(err){
        console.log("err = ", err);
        return res.redirect('back')
    }
};

module.exports.verifyOtp = async (req, res) => {
    try {
        if (req.body.OTP == req.cookies.OTP) {
            console.log("OTP verification successfully");
            res.clearCookie('OTP')
            return res.redirect("/setNewPass")
        } else {
            console.log("Invalid OTP ! Please Try Again...");
            return res.redirect("back")
        }
        
    } catch (error) {
        console.log("Something went wrong");
        res.redirect("back")
    }
};

module.exports.verifyNewPass = async (req, res) => {
    try{
        if (req.body.newPass == req.body.confirmPass) {
            let dataCount = await AdminModel.find({email :req.cookies.email}).countDocuments();
            if (dataCount == 1) {
                let getData = await AdminModel.findOne({email : req.cookies.email});
                let updatePass = await AdminModel.findByIdAndUpdate(getData.id, {password :req.body.newPass})
                if (updatePass) {
                    res.clearCookie('email');
                    console.log("Password changed successfully");
                    return res.redirect('/')
                }
                else {
                    console.log("Something went wrong");
                    res.redirect('back')
                }
                
            }
            else {
                console.log("Email not Found ! Please Check Your Email");
                return res.redirect('/')
            }
            
        }
        else {
            console.log("New Password & Confirmed Password is not match");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log("err = ", err);
        return res.redirect('back');
    }
};