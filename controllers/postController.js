const pool = require('../config/db');

const createPost = async (req,res) => {
    const { title , content } = req.body;
    const user_id = req.user.id;

    try{
        if(!title || !content){
            return res.status(400).json({ message : "Title and Content are required" });
        }

        const post = await pool.query(
            'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title , content, user_id]
        );

        res.status(201).json({
            message : "Post Uploaded successfully",
            post : post.rows[0]
        });
    } catch(err){
        console.error(err.message);
        return res.status(500).json({ message : "Server Error" });
    }
};

const getAllPosts = async (req,res)=>{
    try{
        const posts = await pool.query(`
            SELECT posts.*, users.email as author_email
            FROM posts 
            JOIN users
            ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `);

        if(posts.rowCount === 0){
            return res.status(404).json({ message : "No posts found!!" });
        }

        res.status(200).json({
            message : "Posts fetched Successfully!!",
            posts  :posts.rows
        });
    } catch (err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

const getPostById = async (req,res)=>{
    const id = req.params.id;

    try{
        const post = await pool.query(`
            SELECT posts.*, users.email as author_email
            FROM posts
            JOIN users
            ON posts.user_id = users.id
            WHERE posts.id = $1
        `, [id]);

        if(post.rowCount === 0){
            return res.status(404).json({ message : "No post with this ID found" });
        }

        res.status(200).json({
            message : "Post Found",
            post : post.rows[0]
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

const updatePost = async (req,res)=>{
    const postId = req.params.id; 
    const userId = req.user.id;

    const { title, content } = req.body;

    try{
        if(!title || !content){
            return res.status(400).json({ messagae : "Title or Content is missing" });
        }

        const existingPost = await pool.query(`
            SELECT * FROM posts
            WHERE id = $1
        `, [postId]);

        if(existingPost.rowCount === 0){
            return res.status(404).json({ message : "No Post with this Id found" });
        }

        if(existingPost.rows[0].user_id !== userId){
            return res.status(403).json({ message : "Forbidden" });
        }

        const updatedPost = await pool.query(`
            UPDATE posts
            SET title = $1, content = $2
            WHERE id = $3
            RETURNING *
        ` , [title, content, postId]);

        res.status(200).json({
            message : "Post Updated Successfully",
            updatedPost : updatedPost.rows[0]
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

const deletePost = async (req,res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try{
        const post = await pool.query(`
            SELECT * FROM posts
            WHERE id = $1
        `,[postId]);

        if(post.rowCount === 0){
            return res.status(404).json({ message : "No Post found" });
        }

        if(post.rows[0].user_id !== userId){
            return res.status(403).json({ message : "Forbidden" });
        }

        await pool.query(`
            DELETE FROM posts
            WHERE id = $1            
        `,[postId]);

        res.status(200).json({ message : "Post deleted successfully" });
    } catch (err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

module.exports = { createPost , getAllPosts , getPostById , updatePost , deletePost};