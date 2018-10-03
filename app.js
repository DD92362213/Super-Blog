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
    password: '123456',
    database: 'test'
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
})
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
        <button id="register">register<tton>
    </div>
    <div>
        <button id="cancel">console<tton>
    </div>
</div>`
    res.send(registerDom);
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
                res.cookie('username', result[0].user_name, {});
                res.cookie('loginFlag', '1', {});
                res.redirect("/index");
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


//文章增
app.post('/setpassage', urlencodeParser, (req, res) => {
    connection.query('select passage_title from passage where user_id = ' + req.body.user_id, data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                "flag": "0"
            });
        }
        else {
            if(data.length==0){
                fs.writeFile('./blog_content/'+req.body.user_name+'/'+req.body.passage_title+'.txt',req.body.passage_text,function(err){
                    if(err){
                        res.json({
                            'flag': 0,
                            'msgs':'上传失败请重试！',
                        })
                    }
                    let data = {
                        passage_title: req.body.passage_title,
                        passage_kind: req.body.passage_kind,
                        passage_id: null,
                        passage_url:'./blog_content/'+req.body.user_name+'/'+req.body.passage_title+'.txt',
                        passage_see:0,
                        user_id: req.cookies.user_id,
                        day_see:0,
                    }
                    connection.query('insert into passage set ?', data, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.json({
                                "flag": "0"
                            });
                        }
                        else {
                            res.json({
                                "flag": "1",
                                'msgs':'已有此文章请选择修改或删除！',
                            });
                        }
                    })
                   })
                
            }else{
                res.json({
                    "flag": "0"
                    
                });
            }

        }
    })

})

//文章删
app.post('/delpassage', urlencodeParser, (req, res) => {
    let id = req.body.user_id
    connection.query('delete from passage where passage_id=' + id, data, function (err, result) {
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


app.use(cookieSession({
    name: 'times',
    keys: ['aaa','bbb','ccc','ddd','eee','fff'],
    maxAge: 24 * 3600 * 1000
}));
//文章展示
app.post('/titleList', (req, urlencodeParser, res) => {
    let u_id = req.body.user_id;
    let msg = req.body.passage_msg;
    let p_id = req.body.passage_id;
    if (u_id) {
        connection.query('select passage_title,passage_id from passage where user_id = ' + id, data, function (err, result) {
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
    } else if (msg) {
        connection.query('select passage_title,passage_id from passage where passage_title like"%' + msg + '%"', data, function (err, result) {
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
    } else if (p_id) {
        connection.query('select passage_url from passage where passage_id =' + p_id, data, function (err, result) {
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
                res.sendfile(data.passage_url);
                req.session['passage_see'] += 1;
            }
        })
    }

})

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
})



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



// app.use(bodyParser.json({ limit: '50mb' }));
var server = app.listen(3020, function () {
    var host = server.address().address;
    var port = server.address().port;
    // console.log(router);
    console.log('android server started at http://%s%s', host, port)
})
