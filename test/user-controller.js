const expect = require('chai').expect;
const sinon = require('sinon');

const UserController = requirq("../controllers/user");
const User = require("../models/user");
const AuthRouter = require("../routes/auth");

describe('User Controller test async function', function () {
    it('should register a user', function (done) {
        const user = [{
            username: 'test',
            password: 'test'
        }];
        sinon.stub(User, 'findOne');
        User.findOne.returns(user);

        const res = {
            json: function (body) {
                return body;
            }
        };
        sinon.spy(res, 'render');
        UserController.registerUser({}, res, () => { }).then(function () {
            expect(res.render.called).to.be.true;
            done();
        });
    });
});

describe('Test Auth Router', function () {
    it('should render login page', function () {
        const res = {
            render: function (body) {
                return body
            }
        };
        AuthRouter.get("/login", (req, res, next) => {
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('login');
        })
    });
    it('should render register page', function () {
        const res = {
            render: function (body) {
                return body
            }
        };
        AuthRouter.get("/register", (req, res, next) => {
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('register');
        })
    });
})