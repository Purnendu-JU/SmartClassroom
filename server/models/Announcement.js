// models/Announcement.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    },
    creatorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    files: [{
        type: String
    }]
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
