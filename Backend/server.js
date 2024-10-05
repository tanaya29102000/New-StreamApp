require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Succesfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  video: String, // Store video URL instead of image
});

const Post = mongoose.model('Post', postSchema);

// API to create a post with a video URL
app.post('/api/videos', async (req, res) => {
  try {
    const { title, content, author, video } = req.body; // Accept video URL directly

    // Create a new post with the provided data
    const newPost = new Post({ title, content, author, video });
    console.log(newPost);
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Failed to add post');
  }
});

// API to get all posts
app.get('/api/videos', async (req, res) => {
  try {
    const posts = await Post.find();
   
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Failed to fetch posts');
  }
});

// API to get a specific post by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Failed to fetch post');
  }
});

// API to update a post with a new video URL
app.put('/api/videos/:id', async (req, res) => {
  try {
    const { title, content, author, video } = req.body; // Accept new video URL
    console.log('Received data:', { title, content, author, video });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, video },
      { new: true }
    );

    if (!updatedPost) return res.status(404).send('Post not found');
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('Failed to update post');
  }
});

// API to delete a post by ID
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }

    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Failed to delete post');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
