const express = require('express');

const routes = express.Router();

const commentCtl = require('../controllers/CommentController');

routes.get('/viewComment', commentCtl.viewComment);

routes.get('/changeCommentStatus', commentCtl.changeCommentStatus);

module.exports = routes;