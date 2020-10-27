const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Job = require("../models/job");
const auth = require("../middlewares/auth");
const JobController = require("../controllers/job");

/* Get all the positions */
router.get("/", JobController.getAllJobs);

/* Render Create new position form */
router.get("/create", auth.isManager, function (req, res, next) {
    res.render("./../views/jobs/createJob", {
        job: {},
        isLoggedIn: true,
        isManager: true
    });
});

/* Save new position or update an existing position */
router.post("/saveOrUpdateJob", auth.isManager, JobController.saveOrUpdateJob);

/* Render Update position form by id */
router.get("/update/:id", auth.isManager, function (req, res, next) {
    Job.findOne({ _id: req.params.id }).then((job) => {
        res.render("./../views/jobs/createJob", {
            job: job,
            isLoggedIn: true,
            isManager: true
        });
    });
});

/* Delete Job by id */
router.post("/delete/:id", auth.isManager, JobController.deleteJob);

/* Apply for a job */
router.post("/:id/apply", auth.isEmployee, JobController.applyForJob);

/* Get Job details by id */
router.get("/job/:id", JobController.getJobDetails);

module.exports = router;
