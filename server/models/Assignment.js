const mongoose = require('mongoose');
const {Schema} = mongoose;
const AssignmentSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    file:{
        type: String
    },
    classId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    students:[
        {
            id:{
                type: String,
                required: true
            },
            file:{
                type: String
            }
        }
    ]
});
module.exports = mongoose.model('Assignment', AssignmentSchema);