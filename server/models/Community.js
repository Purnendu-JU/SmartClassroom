const mongoose = require('mongoose');
const {Schema} = mongoose;
const CommunitySchema = new Schema({
    message:{
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
    }
});
module.exports = mongoose.model('comunity', CommunitySchema);