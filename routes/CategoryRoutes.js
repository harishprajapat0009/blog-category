const express = require('express');

const routes = express.Router();

const categoryCtl = require('../controllers/CategoryController');

routes.get('/addCategory', categoryCtl.addCategory);

routes.post('/insertCategory', categoryCtl.insertCategory);

routes.get('/viewCategory', categoryCtl.viewCategory);

routes.get('/deleteCategory', categoryCtl.deleteCategory);

routes.get('/updateCategory/:updateId', categoryCtl.updateCategory);

routes.post('/editCategory', categoryCtl.editCategory);

routes.post('/deleteMultiCategory', categoryCtl.deleteMultiCategory);

routes.get('/changeCategoryStatus', categoryCtl.changeCategoryStatus);


module.exports = routes;