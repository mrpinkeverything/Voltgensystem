const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Welcome page
router.get('/', (req, res) => {
  const company = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/company.json')));
  const projects = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/projects.json')));
  res.render('welcome', { company, projects });
});

// Blog page
router.get('/blog', (req, res) => {
  const blog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog.json')));
  res.render('blog', { blog });
});

// Contact/About page
router.get('/contact', (req, res) => {
  const company = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/company.json')));
  res.render('contact', { company });
});

module.exports = router;
