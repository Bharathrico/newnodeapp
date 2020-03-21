var express = require('express');
var app = express();
var chalk = require('chalk');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var multer = require('multer');
var ejs = require('ejs');
// var TWO_HOURS = 1000 * 60 * 60;
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project"
});
connection.connect(function (error) {
    if (!!error) {
        console.log("error connecting to the database " + chalk.inverse.bold.red("make sure mysql is running"));

    }
    else {
        console.log(chalk.inverse.bold.blue("Database connected"));
        // let selectquery = "SELECT MAX(uploadid) AS maxval FROM uploads;"
        // connection.query(selectquery, (err, rows, fields) => {
        //     if (rows[0].maxval == null) {
        //         maxid = 1;
        //         console.log(rows[0].maxval);
        //     }
        //     else {
        //         maxid = rows[0].maxval + 1;
        //         console.log(maxid);
        //     }
        // });
    }
});
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, req.session.userid + "-" + Date.now() + file.originalname);
    }
});
const upload = multer({
    storage: storage
}).fields([{ name: 'imageup' }, { name: 'model' }]);
app.get('/login', function (req, res) {
    if (req.session.userid) {
        res.redirect("/home");
    }
    else {
        res.sendFile(__dirname + "/html/login.html");
    }
});
app.get('/home', function (req, res) {
    if (req.session.userid) {

        let queryname = "SELECT `uiduser` FROM `users` WHERE `iduser`='" + req.session.userid + "';";
        connection.query(queryname, function (err, rows, fields) {
            let queryname = "SELECT * FROM `uploads`;"
            connection.query(queryname, function (err, rowss, fields) {
                console.log(rowss.length);
                res.render(__dirname + "/html/home.ejs", { nameval: rows[0].uiduser, rowssval: rowss });
            });
        });


    }
    else {
        res.redirect("/");
    }
});

app.post('/signup', function (req, res) {
    if (req.body.emailid == "" || req.body.pass == "" || req.body.username == "" || req.body.firstname == "" || req.body.repass == "" || req.body.lasttname == "") {
        res.redirect("/signup")
    }
    else {
        connection.query("SELECT * FROM `users` WHERE uiduser='" + req.body.username + "';", function (err, rows, fields) {

            if (err || rows.length >= 1) {
                console.log("Username already taken");
                res.redirect("/signup")
            }
            else {

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.pass, salt, function (err, hash) {
                        // Store hash in your password DB.

                        let sendquery = " INSERT INTO `users`(`uiduser`, `emailuser`, `pwduser`, `firstname`, `lastname`) VALUES('" + req.body.username + "','" + req.body.emailid + "','" + hash + "','" + req.body.firstname + "','" + req.body.lastname + "');";
                        connection.query(sendquery, function (err, rows, fields) {
                            if (!!err) {
                                console.log("error in query");
                            }
                            else {
                                res.redirect("/login");
                                console.log("\nsuccessfully new user added");
                                console.log();
                            }
                        });
                    });
                });
            }

        });
    }
});
app.post("/login", function (req, resp) {
    if (req.body.emailid == "" || req.body.pass == "") {
        resp.redirect("/login")
    }
    else {
        let queryname = "SELECT `pwduser`,`iduser` FROM `users` WHERE `emailuser`='" + req.body.emailid + "';";
        connection.query(queryname, function (err, rows, fields) {
            if (rows.length == 1) {
                let hash = rows[0].pwduser;
                bcrypt.compare(req.body.pass, hash, function (err, res) {
                    // res === true
                    if (res === true) {
                        console.log("NEW LOGIN");
                        req.session.userid = rows[0].iduser;
                        resp.redirect("/home");
                    }
                    else {
                        console.log("invalid");
                    }
                });
            }
            else {
                resp.send("invalid Username");
            }

        });
    }
});
app.get("/", function (req, res) {
    if (req.session.userid) {
        res.redirect("/home");
    }
    else {
        res.sendFile(__dirname + "/html/page.html");
    }
});
app.get('/signup', function (req, res) {
    if (req.session.userid) {
        res.redirect("/home");
    }
    else {
        res.sendFile(__dirname + "/html/signup.html")
    }
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        // cannot access session here

    })
    res.redirect("/");
}
);
app.get('/upload', function (req, res) {
    if (req.session.userid) {
        res.sendFile(__dirname + "/html/upload.html")
    }
});
app.get('/account', function (req, res) {
    if (req.session.userid) {

        let queryname = "SELECT `uiduser` FROM `users` WHERE `iduser`='" + req.session.userid + "';";
        connection.query(queryname, function (err, rows, fields) {
            let queryname = "SELECT * FROM `uploads` WHERE `upid`='" + req.session.userid + "';"
            connection.query(queryname, function (err, rowss, fields) {
                console.log(rowss.length);
                res.render(__dirname + "/html/account.ejs", { nameval: rows[0].uiduser, rowssval: rowss });
            });
        });


    }
    else {
        res.redirect("/");
    }
});
app.get('/search/:id', function (req, res) {
    if (req.session.userid) {

        let queryname = "SELECT `uiduser` FROM `users` WHERE `iduser`='" + req.session.userid + "';";
        connection.query(queryname, function (err, rows, fields) {
            let queryname = "SELECT * FROM `uploads` WHERE `title` LIKE '%" + req.params.id + "%';"
            connection.query(queryname, function (err, rowss, fields) {
                console.log(req.params.id);
                res.render(__dirname + "/html/search.ejs", { nameval: rows[0].uiduser, rowssval: rowss, search: req.params.id });
            });
        });


    }
    else {
        res.redirect("/");
    }
});
app.post('/upload', function (req, res) {

    upload(req, res, (err) => {
        if (err) {
            res.send("no file da bunda due to error");
        }
        else {
            let queryname = "SELECT `uiduser` FROM `users` WHERE `iduser`='" + req.session.userid + "';";
            let timeval = Date.now()
            connection.query(queryname, function (err, rows, fields) {
                let queryname = "INSERT INTO `uploads`(`title`, `description`, `options`, `image1`, `file`,`upid`,`timeval`,`username`) VALUES('" + req.body.title + "', '" + req.body.description + "', '" + req.body.option + "', '" + req.files.imageup[0].filename + "', '" + req.files.model[0].filename + "', '" + req.session.userid + "', '" + timeval + "', '" + rows[0].uiduser + "'); ";
                connection.query(queryname, function (err, rowss, fields) {
                    if (!!err) {
                        console.log("error in query:" + err);
                    }
                    else {
                        console.log("succcessfully added");
                    }
                });
                console.log(req.files.model[0].filename);
                res.redirect("/home");
            });
        }
    });
});
app.listen(3000, () => {
    console.log("\nListening to port " + chalk.inverse.bold.green("3000") + "\n");
    console.log("RUNNING ON : " + chalk.underline.green("http://localhost:3000/") + "\n");
});