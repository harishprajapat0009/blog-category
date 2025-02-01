const mongoose = require('mongoose');
const path = require('path');

const imagePath = '/uploads/BlogImages';

const multer = require('multer');

const blogSchema = mongoose.Schema({
    blogTitle : {
        type : String,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CategoryModel',
    },
    blogImage : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default  : true,
    },
    Comment_Ids : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'CommentModel'
    }]
},
{
    timestamps : true
});

const blogImageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath))
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

blogSchema.statics.uploadImageFile = multer({storage : blogImageStorage}).single('blogImage');
blogSchema.statics.imgPath = imagePath;

const BlogModel = mongoose.model('BlogModel', blogSchema);

module.exports = BlogModel;