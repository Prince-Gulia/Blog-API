const express = require('express');
const { createComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();

router.post('/:id/comments',createComment);
router.delete('/:id/comments/:commentId',deleteComment);