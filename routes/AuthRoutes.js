const express = require('express');

const routes = express.Router();

const AuthCtl = require('../controllers/AuthController');

const passport = require('passport');

// Sign In ---- Logout
routes.get('/signIn', AuthCtl.signIn);

routes.post('/signInCheck', passport.authenticate('local', {failureRedirect : '/signIn'}), AuthCtl.signInCheck);

// Forgot Password And Set New Password
routes.get('/checkEmail', (req, res) => {
    return res.render('Authentication/CheckEmail');
});

routes.post('/verifyEmail', AuthCtl.verifyEmail);

routes.get('/checkOtp', (req, res) => {
    try {
        const email = req.cookies.email;
        return res.render('Authentication/CheckOTP',{
            email
        })
    } catch (error) {
        console.log("err = ", error);
        return res.redirect("back")
    }
});

routes.post('/verifyOtp', AuthCtl.verifyOtp);

routes.get('/setNewPass', (req,res) => {
    try {
        return res.render('Authentication/SetNewPass')
    } catch (error) {
        console.log("Something went wrong");
        return res.redirect("back")
    }
});

routes.post('/verifyNewPass', AuthCtl.verifyNewPass);



// Other Routes
routes.use('/',  require('./UserPanelRoutes'));

routes.use('/dashboard', passport.checkAuthUser, require('./AdminRoutes'));

routes.use('/dashboard', passport.checkAuthUser, require('./CategoryRoutes'));

routes.use('/dashboard', passport.checkAuthUser, require('./BlogRoutes'));

routes.use('/dashboard', passport.checkAuthUser, require('./CommentRoutes'));

module.exports = routes;