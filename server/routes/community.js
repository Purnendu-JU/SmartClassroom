const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const comm = require('../models/Community');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');
const sendEmail = require('./emailService');
router.post('/postcommunity', fetchuser, fetchclass, [
    body('message', 'Enter a valid message').isLength({ min: 1 })
], async (req, res) => {
    const { message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const foundClass = req.class;
        const user = await User.findById(req.user.id);
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === req.user.id);
        const isCreator = foundClass.user._id.toString() === req.user.id;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        const msg = new comm({
            message, user: req.user.id,
            classId: foundClass._id
        });
        const savedmsg = await msg.save();
        const temail = await User.findById(foundClass.user);
        const emails = foundClass.students.map(student => student.user.email).filter(email => email !== user.email);
        if (temail.email !== user.email) {
            emails.push(temail.email);
        }
        const emailText = `New Community Message by ${user.fname} ${user.lname}: ${message}`;
        const emailSubject = `New Community Message in ${foundClass.Cname} - ${foundClass.Sname}`;
        sendEmail(emails, emailSubject, emailText);
        res.json(savedmsg);
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});
router.get('/getcommunity', fetchuser, fetchclass, async (req, res) => {
    try {
        const foundClass = req.class;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === req.user.id);
        const isCreator = foundClass.user._id.toString() === req.user.id;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        const data = await comm.find({ classId: foundClass._id });
        const response = await Promise.all(data.map(async (msg) => {
            const user = await User.findById(msg.user);
            return {
                message: msg.message,
                username: user ? `${user.fname} ${user.lname}` : 'Unknown User'
            };
        }));
        res.json(response);
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
