const AdminModel = require('../models/AdminModel');
const CategoryModel = require('../models/CategoryModel');
const BlogModel = require('../models/BlogModel');
const CommentModel = require('../models/CommentModel');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');




// Dashboard
module.exports.dashboard = async (req, res) => {
    try{
        // Category
        let allCategory = await CategoryModel.find({status : true}).populate('Blog_Ids').exec();
        let categoryNames = [];
        let categoryData = [];
        

        allCategory.map((v, i) => {
            categoryNames.push(v.categoryName);
            let activeBlogs = v.Blog_Ids.filter((v, i) => {
                return v.status == true
            })
            categoryData.push(activeBlogs.length);
        });
        
        let totalCategory = await CategoryModel.find({status : true}).countDocuments();

        // Blog
        let allBlog = await BlogModel.find({status : true}).populate('Comment_Ids').exec();
        let totalBlog = await BlogModel.find({status : true}).countDocuments();

        let blogIds = [];
        let totalComments = [];

        allBlog.map((v, i)=>{
            blogIds.push(v.id)
            let activeComments = v.Comment_Ids.filter((v, i) => {
                return v.status == true
            })
            totalComments.push(activeComments.length)
        });

        // Comment
        let allComment = await CommentModel.find({status : true}).countDocuments();

        let totalAdmin = await AdminModel.find().countDocuments();

        return res.render('Admin/Dashboard', {
            categoryNames,
            categoryData,
            totalCategory,
            allBlog,
            totalBlog,
            blogIds,
            totalComments,
            allComment,
            totalAdmin
        })
    }
    catch(error){
        console.log("error = ", error);     
        return res.redirect('back');  
    }
}


// CRUD
module.exports.addAdmin = async (req, res) => {
    try{
        return res.render('Admin/AddAdmin', {
            errorsData : [],
            oldInput : []
        })
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
}

module.exports.insertAdmin = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('Admin/AddAdmin', {
                errorsData : errors.mapped(),
                oldInput : req.body
            })
        }
        else{
            var adminImg = ''
            if(req.file){
                adminImg = AdminModel.imagePath + '/' + req.file.filename;
            }
            req.body.adminImage = adminImg;
            req.body.name = req.body.fname +' '+ req.body.lname;
    
            let AdminData =  await AdminModel.create(req.body);
    
            if(AdminData){
                req.flash('success', "Admin added successfully");
                return res.redirect('/dashboard/addAdmin');
            }
            else{
                req.flash('info', "Somethig went wrong..");
                return res.redirect('/dashboard/addAdmin');
            }
        }
    }
    catch(err){
        req.flash('info', "Cannot get data");
        return res.redirect('back');
    }
}

module.exports.viewAdmin = async (req, res) => {
    try{
        // Search
        let Search = '';
        if(req.query.searchAdmin){
            Search = req.query.searchAdmin;
        }

        // Sorting
        if(req.query.sortBy == "asc"){
            var SingleObj = await AdminModel.find({
                $or : [
                    {name : {$regex : Search, $options : 'i'}},
                    {role : {$regex : Search, $options : 'i'}}
                ]
            }).sort({_id : 1});
        }
        else{
            SingleObj = await AdminModel.find({
                $or : [
                    {name : {$regex : Search, $options : 'i'}},
                    {role : {$regex : Search, $options : 'i'}}
                ]
            }).sort({_id : -1});
        }

        if(SingleObj){
            return res.render('Admin/ViewAdmin', {
                SingleObj,
                Search
            })
        }
        else{
            return res.redirect('/');
        }
    }
    catch{
        req.flash('info', "Data not found");
        return res.redirect('back')
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try{
        let id = req.query.adminId
        let getAdmin = await AdminModel.findById(id);
        if(getAdmin){
            let oldImagePath = path.join(__dirname, '..', getAdmin.adminImage);
            await fs.unlinkSync(oldImagePath);
        }

        let deleteAdmin = await AdminModel.findByIdAndDelete(id);
        if(deleteAdmin){
            req.flash('success', "Data deleted successfully");
            return res.redirect('back');
        }
        else{
            req.flash('error', "Something went wrong");
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("Error = ", error);
        return res.redirect('back');
    }
};

module.exports.updateAdmin = async (req, res) => {
    try{
        let singleObj = await AdminModel.findById(req.params.updateId);
        let flName = singleObj.name.split(" ");
        
        return res.render('Admin/EditAdmin', {
            singleObj,
            flName,
        })
    }
    catch(err){
        console.log("Data not found");
        return res.redirect('back');
    }
};

module.exports.editAdmin = async (req, res) => {
    try{
        let adminData = await AdminModel.findById(req.body.adminId);
        if(req.file){
            // Delete Old Image 
            let deleteImg = path.join(__dirname, '..', adminData.adminImage);
            await fs.unlinkSync(deleteImg);
            
            // Insert New Image
            let newImagePath = await AdminModel.imagePath + '/' + req.file.filename;
            req.body.adminImage = newImagePath;
        }
        else{
            req.body.adminImage = adminData.adminImage;
        }

        req.body.name = req.body.fname +' '+ req.body.lname;
        const updateAdmin = await AdminModel.findByIdAndUpdate(req.body.adminId, req.body);
        
        if(updateAdmin){
            console.log("Data updated successfully");
            
            const newAdminData = await AdminModel.findById(updateAdmin.id);
            if (newAdminData.id == req.user.id) {
                return res.redirect('/dashboard/myProfile')
            }else{
                return res.redirect('/dashboard/viewAdmin');
            }
        }else{
            console.log("Data update failed")
            return res.redirect('back')
        }
    }
    catch(error){
        console.log("Error = ", error);
        return res.redirect('back');
    }
};

// Change Password
module.exports.changePassword = async (req, res) => {
    try{
        return res.render('Admin/ChangePassword')
    }
    catch(err){
        console.log("err = ", err);
        return res.redirect('back');
    }
};

module.exports.changeNewPassword = async (req, res) => {
    try{
        let adminOlddata = req.user;
        if(adminOlddata.password == req.body.currentPass){
            if(req.body.currentPass != req.body.newPass){
                if(req.body.newPass == req.body.confirmPass){
                    await AdminModel.findByIdAndUpdate(adminOlddata.id, {password : req.body.newPass});
                    console.log("Password changed successfully");
                    
                    return res.redirect('/dashboard/signOut');
                }
                else{
                    console.log("New Password and Confirm Password is not match! Try Again");
                    return res.redirect('back')
                }
            }
            else{
                console.log("Currend Password and New Password are same! Please Change");
                return res.redirect('back')
            }
        }
        else{
            console.log("Current Password is Wrong! Try Again");
            return res.redirect('back')
        }
    }
    catch(err){
        console.log("err = ", err);
        return res.redirect('back');
    }
};


// Sign Out
module.exports.signOut = async (req, res) => {
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

