const express = require('express');

const routes = express.Router();

const AdminCtl = require('../controllers/AdminController');

const AdminModel = require('../models/AdminModel');

const passport = require('passport');

const {check, validationResult} = require('express-validator');

// Dashboard
routes.get('/', AdminCtl.dashboard);

// CRUD
routes.get('/addAdmin', AdminCtl.addAdmin);

routes.post('/insertAdmin', AdminModel.uploadImageFile, [
    check('fname').notEmpty().withMessage("Enter First Name").isLength({min : 3}).withMessage("Minimum 3 characters is required"),

    check('lname').notEmpty().withMessage("Enter Last Name").isLength({min : 3}).withMessage("Minimum 3 characters is required"),

    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Email format is wrong").custom(async (value) => {
        let checkEmail = await AdminModel.find({email : value}).countDocuments();
        if(checkEmail > 0){
            throw new Error("Admin Email is already Exist")
        }
    }),

    check('password').notEmpty().withMessage("Password is require").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).withMessage("Password must between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"),

    check('gender').notEmpty().withMessage("Please select gender"),

    check('hobby').notEmpty().withMessage("Please select any one hobby"),

    check('role').notEmpty().withMessage("Please select role"),

    check('message').notEmpty().withMessage("This feild is required")

], AdminCtl.insertAdmin);

routes.get('/viewAdmin', AdminCtl.viewAdmin);
routes.get('/deleteAdmin', AdminCtl.deleteAdmin);
routes.get('/updateAdmin/:updateId', AdminCtl.updateAdmin);
routes.post('/editAdmin', AdminModel.uploadImageFile, AdminCtl.editAdmin);

// Show Profile
routes.get('/myProfile', (req, res) => {
    try{
        return res.render('Admin/MyProfile')
    }
    catch(error){
        console.log("Error = ", error);
        return res.redirect('back');
    }
});

// Change Password
routes.get('/changePassword', AdminCtl.changePassword);

routes.post('/changeNewPassword', AdminCtl.changeNewPassword);

// SignOut
routes.get('/signOut', AdminCtl.signOut);

module.exports = routes;
