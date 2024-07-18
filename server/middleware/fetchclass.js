require('dotenv').config();
const jwt = require('jsonwebtoken');
const classes = require('../models/Createclass');

const fetchclass = async (req, res, next) => {
  const token = req.header('auth');
  if (!token) {
    return res.status(401).send({ error: "Not allowed" });
  }
  try {
    // Decode the token to get the payload
    const data = jwt.verify(token, process.env.JWT);
    // console.log("Reached");
    // console.log(data);
    const classId = data.classe.id;  // Correct the token payload structure

    // Populate the students.user field with the email property
    const foundClass = await classes.findById(classId).populate({
      path: 'students.user',
      select: 'email'
    });

    if (!foundClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    req.class = foundClass;
    next();
  } catch (error) {
    console.error('Error in fetchclass middleware:', error.message);
    res.status(401).send({ error: "Access denied" });
  }
};

module.exports = fetchclass;
