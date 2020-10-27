var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var app = express();

const server = app.listen(1234, function () {
    console.log("Application server is listening on port 1234");
});

const io = require('socket.io').listen(server);

io.on('connection', socket => {
    //send a notification to job's own that an employee has applied for a job 
    socket.on('appliedForJob', (data) => {
        console.log(data);
        console.log(`A notification sent to ${data.createdBy} that user named ${data.username} applied for Job id ${data.jobId}`);
    });

    //send a notification to employees if job is marked as closed
    socket.on('positionMarkedAsClosed', (data) => {
        console.log(data);
        console.log(`A notification sent to employees ${data.appliedBy} who have applied for Job ${data.jobId} that this job has been closed`);
    });
});

require('./config/auth/passport');
const auth = require('./middlewares/auth');

const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const indexRouter = require('./routes/index');

const db = require("./config/database/db");
db.connectToDatabase(process.env.DB_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session(
    {
        secret: 'secret',
        key: process.env.SECRET_KEY,
        cookie: {
            httpOnly: false
        },
        resave: true,
        saveUninitialized: true
    }
));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use("/jobs", auth.authenticateToken, jobsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.locals.token = req.session.token;
    next();
    //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});

module.exports = app;
