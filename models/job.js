const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Status = Object.freeze({
    Open: 'open',
    Closed: 'closed'
});

const JobSchema = new Schema({
    projectName: String,
    clientName: String,
    technologies: String,
    role: String,
    jobDescription: String,
    status: {
        type: String,
        enum: Object.values(Status)
    },
    createdBy: String,
    appliedBy: String
});

Object.assign(JobSchema.statics, { Status });

module.exports = mongoose.model('Job', JobSchema);