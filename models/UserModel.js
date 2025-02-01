const mongoose = require('mongoose');

const path = require('path');

const imagePath = '/uploads/UserImages';

const multer = require('multer');

const UserSchema = mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    userImage : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default  : true,
    }
},
{
    timestamps : true
});

const userImageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath))
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

UserSchema.statics.uploadImageFile = multer({storage : userImageStorage}).single('userImage');
UserSchema.statics.imgPath = imagePath;

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;