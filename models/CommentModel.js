const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    status : {
        type : Boolean,
        default  : true,
    },
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'BlogModel',
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserModel',
    },
    comment : {
        type : String,
        required : true
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'UserModel'
        }
    ],
    dislikes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'UserModel'
        }
    ]
},
{
    timestamps : true
});

const CommentModel = mongoose.model('CommentModel', CommentSchema);

module.exports = CommentModel;