const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/',verifyToken,createPost);
router.get('/',getAllPosts);
router.get('/:id',getPostById);
router.put('/:id',verifyToken,updatePost);
router.delete('/:id',verifyToken,deletePost);

module.exports = router;