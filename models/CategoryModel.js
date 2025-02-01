const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true,
        default  : true,
    },
    Blog_Ids : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'BlogModel'
    }]
},
{
    timestamps : true
});

const CategoryModel = mongoose.model('CategoryModel', categorySchema);

module.exports = CategoryModel;