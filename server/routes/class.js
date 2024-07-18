const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const fetchuser = require('../middleware/fetchuser');
const classes = require('../models/Createclass');
const {body, validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  router.post('/getclass', fetchuser, [
    body('Cname', 'Enter a valid Class name').isLength({ min: 3 }),
    body('Sname', 'Enter a valid Subject name').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let success = false;
        let us = req.user.id;
        const { Cname, Sname } = req.body;

        // Check if the user is the creator of the class
        let Class = await classes.findOne({ $and: [{ Cname, Sname }, { user: new ObjectId(us) }] });

        // If not the creator, check if the user is a student in the class
        if (!Class) {
            Class = await classes.findOne({ Cname, Sname, 'students.user': new ObjectId(us) });
        }

        // If the class is still not found, return an error
        if (!Class) {
            return res.status(400).json({ error: "Please enter correct credentials" });
        }

        const data = {
            classe: {
                id: Class._id
            }
        };
        const name = Class.Cname;
        const auth = jwt.sign(data, process.env.JWT);
        success = true;
        res.json({ auth, name, success });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.get('/landing', fetchuser, async (req, res) => {
    try {
      const createdClasses = await classes.find({ user: req.user.id }).populate('user', 'fname lname');
      const enrolledClasses = await classes.find({ "students.user": req.user.id }).populate('user', 'fname lname');
      const allClasses = {
        createdClasses,
        enrolledClasses
      };
      res.json(allClasses);
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
});
router.post('/createclass', fetchuser, [
    body('Cname', 'Enter the class name').isLength({min: 3}),
    body('Sname', 'Enter Subject Name').isLength({min: 5})
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const ccode = generateRandomCode();
        let cl = await classes.create({
            Cname: req.body.Cname,
            Sname: req.body.Sname,
            code: ccode,
            students: [],
            user: req.user.id
        })
        const data = {
            clas:{
                id: cl.id
            }
        }
        const auth = jwt.sign(data, process.env.JWT);
        res.json({auth, ccode});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;