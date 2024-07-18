const mongoose = require('mongoose');
const {Schema} = mongoose;
const CreateClassSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Cname: {
        type: String,
        required: true
    },
    Sname:{
        type: String,
        required: true
    },
    students: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            Cname: String,
            Sname: String
        }
    ],
    code:{
        type: String,
        default: ''
    }
});
module.exports = mongoose.model('classes', CreateClassSchema);