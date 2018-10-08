var express = require('express');
var app = express();
// var router = app.route();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var cookieSession = require('cookie-session');
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
app.use(bodyParser.json({ limit: '500mb' }));
app.use(cookieParse());
app.use(express.static(__dirname));
app.use(cookieSession({
    name: 'times',
    keys: ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff'],
    maxAge: 24 * 3600 * 1000
}));
app.get('/', function (req, res) {
    res.sendFile("index.html", { root: __dirname + "/routes" });
});
app.get('/getLogin', function (req, res) {
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
});
app.get('/getRegister', function (req, res) {
    let registerDom = `<div class="register">
    <h1>
        Join in us
    </h1>
    <div>
        <input id="username" placeholder="Your name">
    </div>
    <div>
        <input type="password" id="password" placeholder="Your password">
    </div>
    <div>
        <input type="password" id="rePassword" placeholder="Refirm password">
    </div>
    <div>
        <input id="phone" placeholder="Your call-number">
    </div>
    <div>
        <input id="email" placeholder="Your e-mail">
    </div>
    <div>
        <button id="userRegister">register<tton>
    </div>
    <div>
        <button id="cancel">console<tton>
    </div>
</div>`
    res.send(registerDom);
});
app.get('/register', function (req, res) {
    res.sendFile("register.html", { root: __dirname + "/routes" })
});
app.post('/login', urlencodeParser, function (req, res) {
    var data = {
        userAccount: req.body.userAccount,
        password: req.body.password
    }
    let footer = `<footer>
        <nav>
            <div>
                <button id="submit">Submit</button>
            </div>
            <div>
                <button id="cache">Cache</button>
            </div>
            <div>
                <button id="delete">Delete</button>
            </div>
            <div class="setKind">
                <input id = "passageKind" placeholder="Kinds of passage.Default normal">
            </div>
            <div class="uploadBox">
                <button id="upload">Insert Image</button>
                <input id = "uploadImg" type="file" />
            </div>
        </nav>
    </footer>`
    if (data.userAccount && data.password) {
        connection.query('select user_id,user_name,user_level from android_test where (iphone = "' + data.userAccount + '" OR email = "' + data.userAccount + '") AND `password` = "' + data.password + '"', function (err, result) {
            if (err) {
                res.json({ "flag": "0" });
            }
            else {
                if (result.length != 0) {
                    res.cookie('user_id', result[0].user_id, {});
                    res.cookie('username', result[0].user_name, {});
                    res.cookie('user_level', result[0].user_level, {});
                    res.cookie('loginFlag', '1', {});
                    connection.query('select passage_url from passage where user_id = ' + result[0].user_id + ' limit 0,1', function (error, passage) {
                        if (error) {
                            console.log(error)
                        }
                        fs.readFile(passage[0].passage_url, 'utf8', function (fsError, data) {
                            if (fsError) {
                                console.log(fsError);
                            }
                            res.json({
                                data: data,
                                footer: footer,
                                flag: 1
                            });
                        });
                    })
                }
            }
        });
    } else {
        connection.query('select passage_url from passage order by day_see desc limit 0,1', function (err, result) {
            res.cookie('loginFlag', '1', {});
            fs.readFile(result[0].passage_url, 'utf8', function (error, data) {
                res.json({
                    data: data,
                    flag: 0
                });
            });
        });
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
app.post('/uploadImg', urlencodeParser, function (req, res) {
    let file = req.body.file.split(',')[1];
    let data = Buffer.from(file, 'base64');
    let now = Date.now();
    let path = '/img/' + now + '.png';
    fs.writeFile(__dirname + path, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({ path: path });
        }
    });
});
//文章增
app.post('/setPassage', urlencodeParser, (req, res) => {
    let path = './blog_content/' + req.body.user_id;
    let body = {
        passage_id: null,
        passage_title: req.body.passage_title,
        passage_kind: req.body.passage_kind,
        passage_url: path + '/' + req.body.passage_title + '.txt',
        passage_date: Date.now(),
        passage_see: 0,
        passage_good: 0,
        user_id: req.body.user_id,
        day_see: 0,
    }
    let data = {
        data: req.body.passage_content
    }
    if (fs.exists(path)) {
        res.send('Passage is existed.');
    }
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    fs.writeFileSync(path + '/' + body.passage_title + '.txt', data.data, function (err) { if (err) { console.log(err); } });
    connection.query('insert into passage set ?', body, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send('Passage is saved');
        }
    })
});
//文章删
app.post('/delpassage', urlencodeParser, (req, res) => {
    let id = req.body.user_id
    connection.query('delete from passage where passage_id=' + id, function (err, result) {
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
})

//文章展示
app.post('/titleList', urlencodeParser, (req, res) => {
    let u_id = req.body.user_id;
    if (u_id) {
        connection.query('select user_name,passage_title,passage_id,passage_date,passage_kind,passage_see,passage_good from passage,android_test where  passage.user_id = ' + u_id + ' and android_test.user_id=' + u_id, function (err, result) {
            if (err) {
                console.log(err);
                res.json({
                    "flag": "0"
                });
            }
            else {
                res.json(result);
            }
        });
    } else {
        connection.query('select user_name,passage_title,passage_id,passage_date,passage_kind,passage_see,passage_good from passage,android_test where passage.user_id = android_test.user_id order by day_see ', function (err, result) {
            if (err) {
                console.log(err);
                res.json({
                    "flag": "0"
                });
            }
            else {
                res.json(result);

            }
        });
    }

});
app.post('/showPassage', urlencodeParser, (req, res) => {
    let p_id = req.body.passage_id;
    if (!p_id) {
        return;
    }
    connection.query('select passage_url,passage_title from passage where passage_id = ' + p_id, (err, result) => {
        if (err) {
            console.log(err);
            res.json('fail')
        } else {
            fs.readFile(result[0].passage_url, 'utf8', (error, data) => {
                if (error) {
                    console.log(error);
                }
                res.json({
                    title: result[0].passage_title,
                    content: data
                });
            });

        }
    });
});
app.post('/searchPassage', urlencodeParser, (req, res) => {
    let msg = req.body.passage_msg;
    let p_title = req.body.passage_title;
    if (msg) {
        connection.query('select passage_title,passage_id from passage where passage_title like"%' + msg + '%"', function (err, result) {
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
                res.send(data);
            }
        })
    } else if (p_title) {
        connection.query('select passage_url from passage where passage_id =' + p_id, function (err, result) {
            if (err) {
                console.log(err);
                res.json({
                    "flag": "0"
                });
            }
            else {
                res.sendfile(data.passage_url);
                req.session['passage_see'] += 1;
            }
        })
    }
});
//文章更新
app.post('/updatapassage', urlencodeParser, (req, res) => {
    let title = req.body.user_id;
    let kind = req.body.passage_kind;
    let url = req.body.passage_url;
    let arr = [title, kind, url];
    for (vari = 0; i < arr.length; i++) {
        if (title) {
            connection.query('updata passage set passage_title= ' + title, data, function (err, result) {
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
        }
        if (kind) {
            connection.query('updata passage set passage_kind= ' + title, data, function (err, result) {
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
        }
        if (url) {
            connection.query('updata passage set passage_url= ' + url, data, function (err, result) {
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
        }
    }
});
//流量更新
app.post('/Wcloseupdata', urlencodeParser, function (req, res) {
    let p_id = req.body.passage_id;

    connection.query('select passage_see from passage where passage_id =' + p_id, data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                "flag": "0"
            });
        }
        else {
            data.passage_see = tempsee;
        }
    })
    setTimeout(function () {
        connection.query('updata passage set passage_see= ' + req.session['passage_see'] + tempsee, data, function (err, result) {
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
    })

});
var server = app.listen(3020, function () {
    var host = server.address().address;
    var port = server.address().port;
    // console.log(router);
    console.log('android server started at http://%s%s', host, port)
});
