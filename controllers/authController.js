const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async (req,res)=>{
    const {email,password} = req.body;

    try{
        if(!email || !password){
            return res.status(400).json({ message : "Email and Password are required" });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        )

        if(existingUser.rowCount > 0){
            return res.status(400).json({ message : "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, password, created_at',
            [email, hashedPassword]
        );

        console.log(newUser);

        res.status(201).json({
            message : "User created successfully",
            user : newUser.rows[0]
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
};

const login = async (req,res)=>{
    const {email,password} = req.body;

    try{
        if (!email || !password){
            return res.status(400).json({ message : "Email and password are required" });
        }

        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(user.rowCount === 0){
            return res.status(400).json({ message : "Invalid Credentials" });
        }

        const validPassword = await bcrypt.compare(password,user.rows[0].password);

        if(!validPassword){
            return res.status(400).json({ message : "Invalid Credentials" });
        }

        const accessToken = jwt.sign(
            {id : user.rows[0].id , email : user.rows[0].email},
            process.env.JWT_SECRET,
            {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
        )

        const refresh_token = jwt.sign(
            {id : user.rows[0].id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
        )

        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
            [user.rows[0].id , refresh_token]
        );

        res.status(200).json({
            message : "Login Successfully",
            accessToken : accessToken,
            refresh_token : refresh_token
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
};

const getProfile = async (req,res) => {
    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.user.id]
        );

        res.status(200).json({
            message : "Profile fetched Successfully",
            user : user.rows[0]
        });
    } catch(err){
        console.error(err.message);
        return res.status(500).json({ message : "Server Error" });
    }
}

module.exports = { signup , login , getProfile };