const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');

router.get('/getrole', fetchuser, fetchclass, async (req, res) => {
  try {
    const foundClass = req.class;
    const userId = req.user.id;
    const isCreator = foundClass.user.toString() === userId;
    if (isCreator) {
      return res.json({ role: 'teacher' });
    }
    const isEnrolled = foundClass.students.some(student => student.user._id.toString() === userId);
    // console.log(isEnrolled);
    if (isEnrolled) {
      return res.json({ role: 'student' });
    }
    res.status(403).json({ error: "You are not enrolled in this class" });
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
