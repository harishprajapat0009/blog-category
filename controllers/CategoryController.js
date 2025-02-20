const CategoryModel = require('../models/CategoryModel');
const BlogModel = require('../models/BlogModel');
const CommentModel = require('../models/CommentModel');

module.exports.addCategory = async (req, res) => {
    try{
        return res.render('Category/AddCategory');
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.insertCategory = async (req, res) => {
    try{
        let categoryAdded = await CategoryModel.create(req.body);
        if(categoryAdded){
            req.flash('success', "Category added successfully");
            return res.redirect('back');
        }
        else{
            console.log("Something went wrong");    
            return res.redirect('back'); 
        }
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.viewCategory = async (req, res) => {
    try{
        // Pagination
        let perPage = 3;
        let Page = 0;

        if(req.query.page){
            Page = req.query.page
        }

        //Search 
        let Search = '';
        if(req.query.searchCategory){
            Search = req.query.searchCategory;
        }

        // Sorting
        if(req.query.sortBy == "asc"){
             var CategoryData = await CategoryModel.find({categoryName : {$regex : Search, $options : 'i'}}).sort({categoryName : 1}).skip(Page * perPage).limit(perPage);
        }
        else{
            CategoryData = await CategoryModel.find({categoryName : {$regex : Search, $options : 'i'}}).sort({categoryName : -1}).skip(Page * perPage).limit(perPage);
        }

        let totalCategory = await CategoryModel.find({categoryName : {$regex : Search, $options : 'i'}}).countDocuments();

        let TotalCounts = Math.ceil(totalCategory/perPage);

        return res.render('Category/ViewCategory', {
            CategoryData,
            Search,
            Page,
            TotalCounts,
            sortBy : req.query.sortBy
        });
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.deleteCategory = async (req, res) => {
    try{
        // Delete Category
        await CategoryModel.findByIdAndDelete(req.query.categoryId);

        // Delete Blog
        let blog = await BlogModel.find({categoryId : req.query.categoryId})
        blog.map(async (v, i) => {
            
            await BlogModel.findByIdAndDelete({_id : v.id});

            // Delete Comment
            let commentIds = v.Comment_Ids;
            commentIds.map(async (v, i) => {
                await CommentModel.findByIdAndDelete({_id : v})
            })
        })
        return res.redirect('back')
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.updateCategory = async (req, res) => {
    try{
        let singleObj = await CategoryModel.findById(req.params.updateId)
        res.render('Category/UpdateCategory', {
            singleObj
        })
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.editCategory = async (req, res) => {
    try{
        const updateCategory = await CategoryModel.findByIdAndUpdate(req.body.categoryId, req.body);

        if(updateCategory){
            console.log("Category updated successfully");
            return res.redirect('/dashboard/viewCategory')
        }
        else{
            console.log("Something went wrong");    
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.deleteMultiCategory = async (req, res) => {
    try{
       let DeleteAllCategory = await CategoryModel.deleteMany({_id : {$in : req.body.Ids}});
       if(DeleteAllCategory){
            console.log("Category deleted successfully");
            return res.redirect('back')
       }
       else{
        console.log("Something went wrong");    
        return res.redirect('back');
       }
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.changeCategoryStatus = async (req, res) => {
    try{
        // Change category status
        let getCategory = await CategoryModel.findById(req.query.categoryId)
        await CategoryModel.findByIdAndUpdate(getCategory.id, {status : req.query.status});

        // Change blog status of this category
        await BlogModel.updateMany(
            { _id: { $in: getCategory.Blog_Ids } },  // Find blogs where the blog ID is in the category's Blog_Ids array
            { $set: { status: req.query.status } }   // Update the status of the blogs
        );

        // Change comment status of this blog
        for (let blogId of getCategory.Blog_Ids) {
            // Find the blog and its comment IDs
            let blog = await BlogModel.findById(blogId);
            
            if (blog && blog.Comment_Ids && blog.Comment_Ids.length > 0) {
                // Update the comments' status
                await CommentModel.updateMany(
                    { _id: { $in: blog.Comment_Ids } },  // Find comments by their IDs
                    { $set: { status: req.query.status } } // Update status of the comments
                );
            }
        }

        return res.redirect('back')
     }
     catch(error){
         console.log("error = ", error);    
         return res.redirect('back'); 
     }
}



