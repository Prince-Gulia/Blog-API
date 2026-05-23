const express = require('express');
const { createComment, deleteComment } = require('../controllers/commentController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:id/comments',verifyToken,createComment);
router.delete('/:id/comments/:commentId',verifyToken,deleteComment);

module.exports = router;