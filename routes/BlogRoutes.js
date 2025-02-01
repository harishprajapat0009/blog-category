const express = require('express');

const routes = express.Router();

const blogCtl = require('../controllers/BlogController');

const BlogModel = require('../models/BlogModel');

routes.get('/addBlog', blogCtl.addBlog);

routes.post('/insertBlog', BlogModel.uploadImageFile, blogCtl.insertBlog);

routes.get('/viewBlog', blogCtl.viewBlog);

routes.get('/deleteBlog', blogCtl.deleteBlog);

routes.get('/updateBlog/:updateId', blogCtl.updateBlog);

routes.post('/editBlog', BlogModel.uploadImageFile, blogCtl.editBlog);

routes.post('/deleteMultiBlog', blogCtl.deleteMultiBlog);

routes.get('/changeBlogStatus', blogCtl.changeBlogStatus);

module.exports = routes;