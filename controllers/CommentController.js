const CommentModel = require('../models/CommentModel');

module.exports.viewComment = async (req, res) => {
    try{
        //Search 
        let Search = '';
        if(req.query.searchCategory){
            Search = req.query.searchCategory;
        }

        // Sorting
        if(req.query.sortBy == "asc"){
            var commentData = await CommentModel.find({comment : {$regex : Search, $options : 'i'}}).sort({_id : 1});
        }
        else{
            commentData = await CommentModel.find({comment : {$regex : Search, $options : 'i'}}).sort({_id : -1});
        }

        return res.render('Comment/ViewComment', {
            commentData,
            Search
        })
    }
    catch(error){
        console.log("error = ", error);
        return res.redirect('back');
    }
};

module.exports.changeCommentStatus = async (req, res) => {
    try{
        let getComment = await CommentModel.findById(req.query.commentId).populate('blogId').exec();
        if(getComment.blogId.status == true){
            await CommentModel.findByIdAndUpdate(req.query.commentId, {status : req.query.status});
        }
        else{
            req.flash('info', "Please activate this comments blog");
        }
        return res.redirect('back')
     }
     catch(error){
         console.log("error = ", error);    
         return res.redirect('back'); 
     }
}