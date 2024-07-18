const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const classes = require('../models/Createclass');
const {body, validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const fetchclass = require('../middleware/fetchclass');
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
router.get('/getclass', fetchclass, (req, res) => {
    res.json(req.class);
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