const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const classes = require('../models/Createclass');
var jwt = require('jsonwebtoken');
require('dotenv').config();
router.post('/joinclass', fetchuser, [
    body('code', 'Enter correct code').isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { code, Cname, Sname } = req.body;
        let cla = await classes.findOne({ code });

        if (!cla) {
            return res.status(400).json({ error: "Please enter correct code" });
        }

        const userId = req.user.id;
        const isEnrolled = cla.students.some(student => student.user.toString() === userId);
        const isCreator = cla.user.toString() === userId;

        if (isCreator || isEnrolled) {
            return res.status(400).json({ error: "You are already joined" });
        }

        cla.students.push({
            user: req.user.id,
            Cname: Cname,
            Sname: Sname
        });
        await cla.save();
        const data = {
            clas: {
                id: cla.id
            }
        }
        const auth = jwt.sign(data, process.env.JWT);
        res.json({ auth });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
