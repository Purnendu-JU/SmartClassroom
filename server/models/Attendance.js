const mongoose = require('mongoose');
const {Schema} = mongoose;
const AttendanceSchema = new Schema({
    code:{
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    },
    date: {
        type: Date,
        default: Date.now
    },
    students: [{
        type: String
    }]
});
module.exports = mongoose.model('attendance', AttendanceSchema);