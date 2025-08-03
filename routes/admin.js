
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware to check login
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Handle login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/admin.json')));
  if (username === admin.username && password === admin.password) {
    req.session.loggedIn = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

// Admin dashboard
router.get('/dashboard', requireLogin, (req, res) => {
  const blog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog.json')));
  res.render('dashboard', { blog });
});

// Add blog post with image and author
router.post('/add-blog', requireLogin, upload.single('image'), (req, res) => {
  const { title, content, author } = req.body;
  let image = '';
  if (req.file) {
    image = '/images/' + req.file.filename;
  }
  const blog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog.json')));
  blog.unshift({ title, content, author, image, date: new Date().toISOString() });
  fs.writeFileSync(path.join(__dirname, '../data/blog.json'), JSON.stringify(blog, null, 2));
  res.redirect('/admin/dashboard');
});

// Delete blog post
router.post('/delete-blog', requireLogin, (req, res) => {
  const { index } = req.body;
  let blog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog.json')));
  blog.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, '../data/blog.json'), JSON.stringify(blog, null, 2));
  res.redirect('/admin/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
