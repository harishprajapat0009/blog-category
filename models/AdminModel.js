const mongoose = require('mongoose');

const path = require('path');

const adminImagePath = '/uploads/AdminImages';

const multer = require('multer');

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    hobby : {
        type : Array,
        required : true,
    },
    role : {
        type : String,
        required : true,
    },
    adminImage : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        required : true,
    },
},
{timestamps : true});

const adminImageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', adminImagePath));
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

adminSchema.statics.uploadImageFile = multer({storage : adminImageStorage}).single('adminImage');
adminSchema.statics.imagePath = adminImagePath;

const AdminModel = mongoose.model('AdminModel', adminSchema);

module.exports = AdminModel;