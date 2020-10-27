const Job = require("../models/job");
const io = require('socket.io-client');
const socket = io.connect('http://localhost:1234', { reconnect: true });

/* Get All jobs */
async function getAllJobs(req, res, next) {
    if (req.user.role === 'employee') {
        Job.find({ status: 'open' }, function (err, jobs) {
            res.render("./../views/jobs/jobs", {
                message: "All the available positions",
                jobs: jobs,
                isManager: false,
                username: req.user.username,
                isLoggedIn: true
            });
        });
    } else {
        Job.find({ createdBy: req.user.username }, function (err, jobs) {
            res.render("./../views/jobs/jobs", {
                message: "All the positions created by you",
                jobs: jobs,
                isManager: true,
                username: req.user.username,
                isLoggedIn: true
            })
        });
    }
}

/* to save new job details or update the existing one */
async function saveOrUpdateJob(req, res, next) {
    if (req.body._id) {
        Job.findByIdAndUpdate({ _id: req.body._id }, {
            $set: {
                projectName: req.body.projectName,
                clientName: req.body.clientName,
                technologies: req.body.technologies,
                role: req.body.role,
                jobDescription: req.body.jobDescription,
                status: req.body.status
            }
        }, { new: true })
            .then((updatedJob) => {
                console.log("Updated Job", updatedJob);
                if (updatedJob.status === 'closed') {
                    socket.emit("positionMarkedAsClosed", {
                        jobId: updatedJob._id,
                        appliedBy: updatedJob.appliedBy
                    })
                }
                res.redirect("/jobs");
            })
            .catch((err) => {
                console.log("Error while updating a job", err);
            })
    } else {
        const newJob = new Job({
            projectName: req.body.projectName,
            clientName: req.body.clientName,
            technologies: req.body.technologies,
            role: req.body.role,
            jobDescription: req.body.jobDescription,
            status: req.body.status,
            createdBy: req.user.username,
            appliedBy: ''
        });
        newJob.save().then(savedJob => {
            res.redirect("/jobs");
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating job"
            });
            throw err;
        });
    }
}

/* delete a job by jobId */
function deleteJob(req, res, next) {
    var query = {
        _id: req.params.id.toString(),
    };
    Job.findByIdAndDelete(query, function (err, result) {
        if (err) throw err;
        else {
            return res.redirect("/jobs");
        }
    });
}

/* Apply for a job using jobId */
function applyForJob(req, res, next) {
    Job.findOne(
        {
            _id: req.params.id,
        },
        function (err, existingPosition) {
            if (existingPosition) {
                const pos = new Job(existingPosition);
                pos.appliedBy = (pos.appliedBy === undefined ? '' : pos.appliedBy) + "," + req.user.username;
                pos.save().then(savedJob => {
                    socket.emit("appliedForJob", { username: req.user.username, jobId: req.params.id, createdBy: pos.createdBy });
                    res.redirect("/jobs");
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Error while applying for a job"
                    });
                    throw err;
                });
            }
        }
    );
}

/* get a job details using jobId */
function getJobDetails(req, res, next) {
    Job.findOne(
        {
            _id: req.params.id,
        },
        function (err, existingPosition) {
            if (existingPosition) {
                if (req.user.role === 'employee') {
                    res.render("./../views/jobs/jobInfo", {
                        job: existingPosition,
                        username: req.user.username,
                        isManager: false,
                        isLoggedIn: true
                    });
                } else {
                    res.render("./../views/jobs/jobInfo", {
                        job: existingPosition,
                        username: req.user.username,
                        isManager: true,
                        isLoggedIn: true
                    });
                }
            }
        }
    );
}

module.exports = {
    getAllJobs,
    saveOrUpdateJob,
    deleteJob,
    applyForJob,
    getJobDetails
}