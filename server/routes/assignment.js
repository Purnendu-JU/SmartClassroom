const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const ass = require('../models/Assignment');
const sendEmail = require('./emailService');
const multer = require('multer');
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
    limits: { fileSize: 100 * 1024 * 1024 }
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

router.post('/postassignment', fetchuser, fetchclass, upload.single('file'), [
    body('title', 'Title cannot be blank').isLength({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === userId);
        const isCreator = foundClass.user._id.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if (isEnrolled && !isCreator) {
            return res.status(400).json({ error: "Access denied" });
        }

        let fileId = null;
        if (req.file) {
            fileId = await uploadFileToGoogleDrive(req.file.buffer, req.file.originalname);
        }

        let assign = new ass({
            title: req.body.title,
            classId: foundClass._id,
            user: userId,
            file: fileId,
            students: []
        });
        const savedassign = await assign.save();
        const emails = foundClass.students.map(student => student.user.email);
        const emailText = `New Assignment Posted: ${req.body.title}`;
        const emailSubject = `New Assignment in ${foundClass.Cname} - ${foundClass.Sname}`;
        sendEmail(emails, emailSubject, emailText);
        res.json(savedassign);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});

router.post('/submitassignment', fetchuser, fetchclass, upload.single('file'), [
    body('title', 'Enter a valid title').isLength({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Blank file cannot be submitted. Please upload a file." });
    }
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === userId);
        const isCreator = foundClass.user._id.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if (isCreator) {
            return res.status(403).json({ error: "You can't upload" });
        }
        const assignmentTitle = req.body.title.toString();
        let t = await ass.findOne({ classId: foundClass._id, title: assignmentTitle });
        if (!t) {
            return res.status(500).send("No such assignment exists");
        }
        const isSubmitted = t.students.some(student => student.id === userId);
        if (isSubmitted) {
            return res.status(400).send("Already submitted");
        }

        const fileId = await uploadFileToGoogleDrive(req.file.buffer, req.file.originalname);

        t.students.push({ id: userId, file: fileId });
        await t.save();
        res.send("Submitted successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/getassignment', fetchuser, fetchclass, async (req, res) => {
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === userId);
        const isCreator = foundClass.user._id.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        let assignments = await ass.find({ classId: foundClass._id });
        let response = [];
        if (isCreator) {
            for (let assign of assignments) {
                let studentsWithNames = [];
                for (let student of assign.students) {
                    let user = await User.findById(student.id);
                    studentsWithNames.push({
                        name: `${user.fname} ${user.lname}`,
                        file: student.file
                    });
                }
                response.push({
                    title: assign.title,
                    file: assign.file,
                    students: studentsWithNames
                });
            }
        } else {
            for (let assign of assignments) {
                let studentFile = assign.students.find(student => student.id === userId);
                response.push({
                    title: assign.title,
                    file: assign.file,
                    studentFile: studentFile ? studentFile.file : null
                });
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
