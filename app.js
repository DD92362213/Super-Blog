var express = require('express');
var app = express();
// var router = app.route();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var cookieParse = require('cookie-parser');
var ipAddress = '127.0.0.1';
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'android_test'
})
var urlencodeParser = bodyParser.urlencoded({
    extended: true,
});
app.use(bodyParser.json())
app.use(cookieParse());
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile("index.html", { root: __dirname + "/routes" });
});
app.get('/index', function (req, res) {
    res.sendFile("test.txt", { root: __dirname + "/blog_content" });
});
app.get('/getLogin',function(req,res){
    let loginDom = `<div class="login">
    <h1>
        Sign in
    </h1>
    <div>
        <input id="useraccount" placeholder="email or phone">
    </div>
    <div>
        <input type="password" id="password" placeholder="password">
    </div>
    <div>
        <button id="login">login</button>
    </div>
    <div>
        <button id="register">register</button>
    </div>
</div>`
    res.send(loginDom);
})
app.get('/register', function (req, res) {
    res.sendFile("register.html", { root: __dirname + "/routes" })
})
app.post('/login', urlencodeParser, function (req, res) {
    var data = {
        userAccount: req.body.userAccount,
        password: req.body.password
    }
    if (data.userAccount) {
        connection.query('select user_name,user_level from android_test where (iphone = "' + data.userAccount + '" OR email = "' + data.userAccount + '") AND `password` = "' + data.password + '"', function (err, result) {
            if (err) {
                res.json({ "flag": "0" });
            }
            else {
                console.log(result)
                // res.json({
                //     flag:1
                // })
                if(result.length != 0){
                    res.cookie('username', result[0].user_name, {});
                    res.cookie('loginFlag', '1', {});
                    res.redirect("/index");
                }
                
            }
        });
    } else {
        res.json({
            fail: 1
        })
    }

});
app.post('/register', urlencodeParser, function (req, res) {
    var data = {
        user_name: req.body.username,
        user_id: null,
        password: req.body.password,
        email: req.body.email,
        iphone: req.body.iphone,
        user_level: 0,
        user_g: 0,
    }
    connection.query('insert into android_test set ?', data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                "flag": "0"
            });
        }
        else {
            res.json({
                "flag": "1"
            });
        }
    })
});
app.post('/selectAllNews', urlencodeParser, function (req, res) {
    // res.cookie('user', 'Ashes', {});
    connection.query('select * from image,news where news.news_id= image.image_id', function (err, result) {
        if (err) {
            console.log(err);
            res.json({ "flag": "0" });
        }
        else {
            res.json(result)
        }
    })
})
app.post('/newsDetial', urlencodeParser, function (req, res) {
    var id = req.body.newID;
    connection.query('select * from image,news where image.news_id = ' + id + ' and news.news_id = ' + id, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ "flag": "0" });
        }
        else {
            res.json(result[0])
        }
    })
});
app.post('/getNewsCount', urlencodeParser, function (req, res) {
    connection.query('select count(`news_id`) as kinds_of_count,news_kind from news group by news_kind', function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                fail: 1
            });
        } else {
            res.json({
                success: 1,
                result: result
            })
        }
    })
})
// app.use(bodyParser.json({ limit: '50mb' }));
var server = app.listen(3020, function () {
    var host = server.address().address;
    var port = server.address().port;
    // console.log(router);
    console.log('android server started at http://%s%s', host, port)
})
