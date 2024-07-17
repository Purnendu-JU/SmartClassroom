require('dotenv').config();
const jwt = require('jsonwebtoken');
const classes = require('../models/Createclass');
const fetchclass = async (req, res, next) => {
    const token = req.header('auth');
    if (!token) {
        return res.status(401).send({ error: "Not allowed" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT);
        const classId = data.clas.id;

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
        console.error(error.message);
        res.status(401).send({ error: "Access denied" });
    }
};

module.exports = fetchclass;
