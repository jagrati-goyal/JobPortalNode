const expect = require('chai').expect;
const sinon = require('sinon');

const JobController = require("../controllers/job");
const Job = require('../models/Job');
const JobRouter = require("../routes/jobs");

describe('Job Controller test async function', function () {
    it('should fetch list of jobs', function (done) {
        const jobs = [{
            projectName: 'test',
            technologies: 'test',
            status: 'open',
            role: 'test'
        }];
        sinon.stub(Job, 'find');
        Job.find.returns(jobs);

        const res = {
            json: function (body) {
                return body;
            }
        }
        sinon.spy(res, 'json');
        JobController.getAllJobs({}, res, () => { }).then(function () {
            expect(res.json.called).to.be.false;
            done();
        })
    })
});

describe("Test Jobs Router", function () {
    it('should get all the jobs', function () {
        const res = {
            render: function (body) {
                return body
            }
        };
        JobRouter.get("/", (req, res, next) => {
            expect(res.render.called).to.be.true;
        })
    });
    it('should apply for a particular job', function () {
        const res = {
            render: function (body) {
                return body
            }
        };
        const id = ObjectID("5f95e87f33fec1766c16c669");
        JobRouter.post(`/${id}/apply`, (req, res, next) => {
            expect(res.render.called).to.be.true;
        });
    });
});