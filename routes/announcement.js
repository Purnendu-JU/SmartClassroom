const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const announ = require('../models/Announcement');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');
const multer = require('multer');
const sendEmail = require('./emailService');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});
router.post('/postannouncement', fetchuser, fetchclass, upload.array('files'), [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('content', 'Enter a valid content').isLength({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, content } = req.body;
        const foundClass = req.class;
        const isCreator = foundClass.user.toString() === req.user.id;
        if (!isCreator) {
            return res.status(403).json({ error: "Access denied. Only the class creator can post announcements." });
        }
        const user = await User.findById(req.user.id);
        const files = req.files ? req.files.map(file => file.filename) : [];
        const announcement = new announ({
            title,
            content,
            user: req.user.id,
            classId: foundClass._id,
            creatorName: `${user.fname} ${user.lname}`,
            files
        });
        const savedAnn = await announcement.save();
        const emails = foundClass.students.map(student => student.user.email).filter(email => email !== req.user.email);
        if (emails.length === 0) {
            console.log('No recipients to send the email to.');
        } 
        else {
            const emailText = `New Announcement by ${user.fname} ${user.lname}: ${title}\n${content}`;
            const emailSubject = `New Announcement in ${foundClass.Cname} - ${foundClass.Sname}`;
            sendEmail(emails, emailSubject, emailText);
        }
        res.json(savedAnn);
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});
router.get('/getannouncement', fetchuser, fetchclass, async (req, res) => {
    try {
        const foundClass = req.class;
        const isEnrolled = foundClass.students.some(student => student.user.toString() === req.user.id);
        const isCreator = foundClass.user.toString() === req.user.id;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        const announces = await announ.find({ classId: foundClass._id }).populate('user', 'name');
        res.json({ announces, isCreator });
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
