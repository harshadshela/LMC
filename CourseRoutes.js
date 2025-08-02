const express = require('express');
const Course = require('../Modal/Course');
const router = express.Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
