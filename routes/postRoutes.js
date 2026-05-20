const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById } = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/',verifyToken,createPost);
router.get('/',getAllPosts);
router.get('/:id',getPostById);

module.exports = router;