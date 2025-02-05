const express = require('express');

const routes = express.Router();

const userCtl = require('../controllers/UserPanelController');

const UserModel = require('../models/UserModel');

const Passport = require('passport')

// Register
routes.get('/userRegister', async (req, res) => {
    try{
        return res.render('UserPanel/UserRegister')
    }
    catch(error){
        console.log("error = ", error);
        return res.redirect('back')
    }
});

routes.post('/insertUser', UserModel.uploadImageFile, userCtl.insertUser);

// Login
routes.get('/userLogin', async (req, res) => {
    try{
        return res.render('UserPanel/UserLogin')
    }
    catch(error){
        console.log("error = ", error);
        return res.redirect('back')
    }
});
routes.post('/insertLogin', Passport.authenticate("userAuth", {failureRedirect : '/userLogin'}), userCtl.insertLogin);

// Logout
routes.get('/userLogout', userCtl.userLogout);

// Home
routes.get('/', userCtl.home);

routes.get('/blogDetails', userCtl.blogDetails);

// Comments
routes.post('/insertComments', userCtl.insertComments);

routes.get('/deleteComment/:commentId', userCtl.deleteComment);

// Likes
routes.get('/setUserLikes/:commentId', userCtl.setUserLikes);

routes.get('/setUserDislikes/:commentId', userCtl.setUserDislikes)

module.exports = routes;


