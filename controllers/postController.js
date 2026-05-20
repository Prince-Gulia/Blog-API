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
    const posts = await pool.query(
        'SELECT posts.*, users.email as author_email FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
    );

    if(posts.rowCount === 0){
        return res.status(404).json({ message : "No Posts found" });
    }

    res.status(200).json({
        message : "Fetched Successfully",
        posts : posts.rows
    });
    
}

const getPostById = async (req,res)=>{
    const id = req.params.id;

    const post = await pool.query(
        'SELECT posts.* , users.email as author_email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1',
        [id]
    );

    if(post.rowCount === 0){
        res.status(404).json({ message : "Post Not Found" });
    }

    res.status(201).json({
        message : "Post Fetched Successfully",
        post : post.rows[0]
    });
}

module.exports = { createPost , getAllPosts , getPostById};