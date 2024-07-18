const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const announ = require('../models/Announcement');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');
const multer = require('multer');
const sendEmail = require('./emailService');
const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');

// Load the Google Drive service account credentials
const keyFilePath = path.join(__dirname, '../atlantean-house-429606-g0-0a1e0d2d32e4.json');

// Configure the Google Drive client
const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

const uploadFolderId = '1c2JerY5xU5dlOZICDi8i8GRNJ8Yatm22';

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000 * 1024 * 1024 }
});

const bufferToStream = (buffer) => {
    const readable = new stream.Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(buffer);
    readable.push(null);
    return readable;
};

const uploadFileToGoogleDrive = async (buffer, fileName) => {
    const fileMetadata = {
        name: fileName,
        parents: [uploadFolderId]
    };
    const media = {
        mimeType: 'application/octet-stream',
        body: bufferToStream(buffer)
    };
    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });
    return response.data.id;
};

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
        let files = [];

        if (req.files) {
            for (const file of req.files) {
                const googleFileId = await uploadFileToGoogleDrive(file.buffer, file.originalname);
                files.push(googleFileId);
            }
        }

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
        } else {
            const emailText = `New Announcement by ${user.fname} ${user.lname}: ${title}\n${content}`;
            const emailSubject = `New Announcement in ${foundClass.Cname} - ${foundClass.Sname}`;
            sendEmail(emails, emailSubject, emailText);
        }
        res.json(savedAnn);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});

router.get('/getannouncement', fetchuser, fetchclass, async (req, res) => {
    try {
        const foundClass = req.class;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === req.user.id);
        const isCreator = foundClass.user.toString() === req.user.id;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        const announces = await announ.find({ classId: foundClass._id }).populate('user', 'name');
        res.json({ announces, isCreator });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
