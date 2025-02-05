const CategoryModel = require('../models/CategoryModel');
const BlogModel = require('../models/BlogModel');
const CommentModel = require('../models/CommentModel');
const UserModel = require('../models/UserModel');
const path = require('path');

// Authentication
module.exports.insertUser = async (req, res) => {
    try{
        var userImg = '';
        if(req.file){
            userImg = await UserModel.imgPath + '/' + req.file.filename;
        }
        req.body.userImage = userImg;

        const userData = await UserModel.create(req.body); 
        if(userData){
            console.log("Restration Successfully");
            return res.redirect('/userLogin')
        }
    }
    catch(error){
        console.log("error = ", error);
        return res.redirect('back')
    }
}

module.exports.insertLogin = async (req, res) => {
    try{
        if(req.cookies.blogPageUrl){
            return res.redirect(req.cookies.blogPageUrl)
        }
        else{
            return res.redirect('/');
        }
    }
    catch(error){
        console.log("error = ", error);
        return res.redirect('back')
    }
}

module.exports.userLogout = async (req, res) => {
    try{
        req.session.destroy(function(err) {
            if(err){
                return false;
            }
            return res.redirect('/');
        })
    }
    catch(error){
        console.log("Error = ", error);
        return res.redirect('back');
    }
}

// Home
module.exports.home = async (req, res) => {
    try{
        res.clearCookie('blogPageUrl')

        // Search
        let Search = '';
        if(req.query.searchBlog){
            Search = req.query.searchBlog;
        }

        if(req.query.catId){
           var allBlog = await BlogModel.find({status : true, categoryId : req.query.catId}).populate('categoryId').exec()
        }
        else{
            if(req.query.sortBy == "asc"){
                allBlog = await BlogModel.find({status : true, blogTitle : {$regex : Search, $options : 'i'}}).sort({_id : 1}).populate('categoryId').exec();
            }
            else{
                allBlog = await BlogModel.find({status : true, blogTitle : {$regex : Search, $options : 'i'}}).sort({_id : -1}).populate('categoryId').exec();
            }
        }

        const totalBlog = await BlogModel.find({status : true}).countDocuments();
        const allCategory = await CategoryModel.find({status : true});
        
        return res.render('UserPanel/Home',{
            allCategory,
            allBlog,
            totalBlog,
            Search
        });
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back')
    }
};

module.exports.blogDetails = async (req, res) => {
    try{
        res.cookie('blogPageUrl', `blogDetails/?blogId=${req.query.blogId}`)

        const singleBlog = await BlogModel.findById(req.query.blogId);
        const allBlog = await BlogModel.find({status : true}).limit(5).sort({_id : -1}).populate('categoryId').exec();

        const getComment = await CommentModel.find({status : true, blogId : req.query.blogId}).populate('userId').exec();

        return res.render('UserPanel/BlogDetails',{
            singleBlog,
            allBlog,
            getComment
        })
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back');
    }
};

//Comments
module.exports.insertComments = async (req, res) => {
    try{
        let addComment = await CommentModel.create(req.body);
        // ORM
        if(addComment){
            let findBlog = await BlogModel.findById(req.body.blogId);
            findBlog.Comment_Ids.push(addComment._id);
            await BlogModel.findByIdAndUpdate(req.body.blogId, findBlog);
        }

        console.log("Comment Added Successfully");
        return res.redirect('back')
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back');
    }
};

module.exports.deleteComment = async (req, res) => {
    try{
        let getComment = await CommentModel.findById(req.params.commentId)
        let deleteComment = await CommentModel.findByIdAndDelete(getComment.id);
        if(deleteComment){
                console.log("Comment deleted Successfully");

                // Remove comment id from blog model
    
                await BlogModel.findByIdAndUpdate(
                    getComment.blogId, 
                    { $pull: { Comment_Ids : getComment.id } }
                );
                return res.redirect('back');
        }
       else{
            console.log("Comment not deleted");
            return res.redirect('back');
       }
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back');
    }
};



// Likes
module.exports.setUserLikes = async (req, res) => {
    try{
        let singleComment = await CommentModel.findById(req.params.commentId);
        if(singleComment){
            let likesUserAlreasyExist = await singleComment.likes.includes(req.user._id);
            if(likesUserAlreasyExist){
                // Remove user id from likes array
  
                // await CommentModel.findByIdAndUpdate(
                //     singleComment, 
                //     { $pull: { likes : req.user._id } }
                // );
                // return res.redirect('back');

                let newLikes = singleComment.likes.filter((v, i) => {
                    if(!v.equals(req.user._id)){
                        return v
                    }
                })

                singleComment.likes = newLikes;
            }
            else{
                // Add user id into likes array
                singleComment.likes.push(req.user._id);
            }

            
            let dislikesUserAlreasyExist = await singleComment.dislikes.includes(req.user._id);
            if(dislikesUserAlreasyExist){
                let newDislikes = singleComment.dislikes.filter((v, i) => {
                    if(!v.equals(req.user._id)){
                        return v
                    }
                })
                
                singleComment.dislikes = newDislikes;
            }
            await CommentModel.findByIdAndUpdate(req.params.commentId, singleComment);
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back');
    }
};

// Dislikes
module.exports.setUserDislikes = async (req, res) => {
    try{
        let singleComment = await CommentModel.findById(req.params.commentId);
        if(singleComment){
            let dislikesUserAlreasyExist = await singleComment.dislikes.includes(req.user._id);
            if(dislikesUserAlreasyExist){
                // Remove user id from dislikes array
  
                // await CommentModel.findByIdAndUpdate(
                //     singleComment, 
                //     { $pull: { dislikes : req.user._id } }
                // );
                // return res.redirect('back');

                let newDislikes = singleComment.dislikes.filter((v, i) => {
                    if(!v.equals(req.user._id)){
                        return v
                    }
                })

                singleComment.dislikes = newDislikes;
            }
            else{
                // Add user id into likes array
                singleComment.dislikes.push(req.user._id);
            }
            
            let likesUserAlreasyExist = await singleComment.likes.includes(req.user._id);
            if(likesUserAlreasyExist){
                let newLikes = singleComment.likes.filter((v, i) => {
                    if(!v.equals(req.user._id)){
                        return v
                    }
                })
                
                singleComment.likes = newLikes;
            }
            
            await CommentModel.findByIdAndUpdate(req.params.commentId, singleComment);
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("error =", error);
        return res.redirect('back');
    }
}
