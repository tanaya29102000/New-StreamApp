const express = require('express');
const BlogPost = require('../BlogPost');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Append timestamp to filename
  }
});

// Accept only video files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|avi|mkv/;  // Allow video types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only videos are allowed'));
    }
  }
});

// Create a new blog post with a video
router.post('/create', upload.single('video'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new BlogPost({
      title,
      content,
      author,
      videoUrl: req.file ? req.file.filename : null  // Save the video filename
    });
    
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all blog posts
router.get('/videos', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single blog post by ID
router.get('/videos/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a blog post with a new video
router.put('/videos/:id', upload.single('video'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updateData = { title, content, author };

    // If a new video is uploaded, add it to the update data
    if (req.file) {
      updateData.videoUrl = req.file.path.replace(/\\/g, '/');
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog post by ID
router.delete('/videos/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If the post has a video, delete it from the file system
    if (post.videoUrl) {
      const videoPath = path.join(__dirname, '../uploads', post.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);  // Delete video from server
      }
    }

    res.status(200).json({ message: 'Post and video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
