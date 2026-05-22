const pool = require('../config/db');

const createComment = async (req,res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const {content} = req.body;

    try{
        if(!content){
            return res.status(400).json({ message : "Content missing" });
        }

        const post = await pool.query(`
            SELECT * FROM posts
            WHERE id = $1
        `,[postId]);

        if(post.rowCount === 0){
            return res.status(404).json({ message : "Post not found" });
        }

        const comment = await pool.query(`
            INSERT INTO comments (content, user_id, post_id)
            VALUES ($1, $2, $3) 
            RETURNING *
        `, [content, postId, userId]);

        res.status(201).json({
            message : "Comment added successfully",
            comment : comment.rows[0]
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

const deleteComment = async (req,res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const commentId = req.params.commentId;

    try{
        const comment = await pool.query(`
            SELECT * FROM comments
            WHERE id = $1
        `,[commentId]);

        if(comment.rowCount === 0){
            return res.status(404).json({ message : "Comment not found" });
        }

        if(comment.rows[0].user_id !== userId){
            return res.status(403).json({ message : "Forbidden" });
        }

        await pool.query(`
            DELETE FROM comments
            where id = $1
        `,[commentId]);

        res.status(200).json({ message : "Comment deleted successfully" });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

module.exports = {createComment, deleteComment}