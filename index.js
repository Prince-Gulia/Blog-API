const express = require('express')
const pool = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({ message : "Backend is Live!!!" });
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log(`Server is running on : ${PORT}`);
});