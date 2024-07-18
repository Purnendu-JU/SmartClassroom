const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const fetchclass = require('../middleware/fetchclass');
const attendance = require('../models/Attendance');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const handleGenerateCode = () => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000);
    return generatedCode;
};
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
router.post('/generateattendance', fetchuser, fetchclass, async(req, res) => {
    try{
        const foundClass = req.class;
        const isEnrolled = foundClass.students.some(student => student.user.toString() === req.user.id);
        const isCreator = foundClass.user.toString() === req.user.id;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if(isEnrolled && !isCreator){
            return res.status(400).json({error: "Access denied"});
        }
        const ccode = handleGenerateCode();
        let atten = new attendance({
            code: ccode,
            user: req.user.id,
            students: [],
            classId: foundClass._id
        })
        const savedatten = await atten.save();
        res.json(savedatten);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
})
router.post('/markattendance', fetchuser, fetchclass, [
    body('code', 'Enter correct code').isLength({ min: 6, max: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const { code } = req.body;
        const isEnrolled = foundClass.students.some(student => student.user._id.toString() === userId);
        const isCreator = foundClass.user.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if (isCreator) {
            return res.status(403).json({ error: "Access Denied" });
        }
        let att = await attendance.findOne({ classId: foundClass._id, code: code })
        if (!att) {
            return res.status(401).json({ error: "Please enter correct code" });
        }
        const isMarked = att.students.some(student => student === userId);
        if(isMarked){
            return res.status(400).send("Already marked");
        }
        att.students.push(userId);
        await att.save();
        res.send("Attendance marked for today");
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.put('/disablecode', fetchuser, fetchclass, [
    body('code', 'Enter correct code').isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const { code } = req.body;
        const isEnrolled = foundClass.students.some(student => student.user.toString() === userId);
        const isCreator = foundClass.user.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if (isEnrolled && !isCreator) {
            return res.status(403).json({ error: "Access Denied" });
        }
        let catt = await attendance.findOne({ classId: foundClass._id, code: code });
        if (!catt) {
            return res.status(404).send("Attendance record not found");
        }
        catt.code = generateRandomCode();
        await catt.save();
        res.status(200).json({ catt });
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.get('/getattendance', fetchuser, fetchclass, async(req, res) => {
    try {
        const foundClass = req.class;
        const userId = req.user.id;
        const isEnrolled = foundClass.students.some(student => student.user.toString() === userId);
        const isCreator = foundClass.user.toString() === userId;
        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ error: "You are not enrolled in this class" });
        }
        if (!isCreator) {
            return res.status(403).json({ error: "Access Denied" });
        }
        let catt = await attendance.find({ classId: foundClass._id });
        if (!catt.length) {
            return res.status(404).send("No attendance records found");
        }
        const response = await Promise.all(catt.map(async (entry) => {
            const students = await User.find({ _id: { $in: entry.students } }).select('fname lname');
            const studentNames = students.map(student => `${student.fname} ${student.lname}`);
            return {
                date: entry.date,
                students: studentNames
            };
        }));
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});

module.exports = router;