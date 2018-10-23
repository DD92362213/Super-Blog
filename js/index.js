var ip = 'http://127.0.0.1:3020/';
// var ip = 'http://112.74.165.209:3020/';
var event = new eventEmitter(); //from ajax.js
const slider = document.querySelector('.sliderBox');
let text1 = document.querySelector('.text1');
let text2 = document.querySelector('.text2');
let textval = document.getElementsByClassName('in');
let bt = document.querySelectorAll('.userlv');
let cursortPosition = null;
text1.classList.add('text_cg');
text1.classList.add('fad');
bt[0].addEventListener("mouseover", () => cg_in(bt[0]));
bt[1].addEventListener("mouseover", () => cg_in(bt[1]));
bt[0].addEventListener("mouseout", () => cg_in(bt[0]));
bt[1].addEventListener("mouseout", () => cg_in(bt[1]));
function login() {ajax(ip + "getLogin", 'get', null, function (data) {
    let user = document.querySelector('.user');
    let right = document.querySelector('.right');
    let left = document.querySelector('.left');
    if (data.srcElement.readyState == 4) {
        user.innerHTML = data.srcElement.response;
        event.emit('create', { flag: 1, right: right, user: user });
    }
});}
login();
let animationSolve = (data, data1) => {
    if (data1.srcElement.readyState != 4) {
        return;
    }
    if (getCookieItem('loginFlag') != '1') {
        return;
    }
    let container = document.querySelector('.container');
    let callBox = document.querySelector('.callBox');
    let userInfo = document.querySelector('.userInfo');
    let passageList = document.querySelector('.passageList');
    let footer = JSON.parse(data1.srcElement.response).footer ? JSON.parse(data1.srcElement.response).footer : '';
    callBox.classList.add('callBoxLogin');
    container.classList.add('loginAnimation');
    setTimeout(function () {
        container.classList.add('loginFinish');
        callBox.classList.remove('callBoxLogin');
        callBox.classList.add('callBoxLogined');
        passageList.classList.remove('hiddenList')
        data.right.innerHTML =
        `<div class='searcbox'><input type="text" class='in_cg'><img src="../img/search.png" class='search_cg'></div>
        <div class="contentBox" contenteditable="true">
        <h2 id='title'>Default Passage</h2>
        ${JSON.parse(data1.srcElement.response).data}    
                </div>
                ${footer}
                `;
        event.emit('listshow', { success: 1, flag: JSON.parse(data1.srcElement.response).flag });
        event.emit('search_cg');
    }, 750);


}
function createListItem(content, i, timer) {
    let itemTemplate = document.createElement('div');
    let date = parseInt(content[i].passage_date);
    date = new Date(date)
    console.log(date)
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    itemTemplate.classList.add('passageItem');

    itemTemplate.setAttribute('data-itemId', content[i].passage_id);

    let itemContent =
        `<div class="passageTitle">
    <span style="flex:3">${content[i].passage_title}</span>
    <span>${content[i].user_name}</span>
    </div>
    <div class="passageKind">
        <span>${content[i].passage_kind}</span>
    </div>
    <div class="passageInfo">
        <span style="flex:3">${date}</span>
        <span>${content[i].passage_good}</span>
        <span>${Math.round(Math.random(1)*10)}</span>
    </div>`
    itemTemplate.innerHTML = itemContent;
    slider.appendChild(itemTemplate);

}
function sliderAction(e) {
    let timer = undefined;
    clearTimeout(timer);
    timer = setTimeout(function () {
        let top = slider.offsetTop;
        let _delta = parseInt(e.wheelDelta);
        if (!slider.style.marginTop) {
            slider.style.marginTop = (top - 10) + 'px';
        }
        if (_delta < 0) {
            if (slider.offsetHeight - slider.scrollHeight) {
                slider.style.marginTop = (parseInt(slider.style.marginTop) - 10) + 'px';
            }
        }
        else {
            if (Math.abs(Math.abs(top) - 10) > 20) {
                slider.style.marginTop = (parseInt(slider.style.marginTop) + 10) + 'px';
            }
        }
    }, 16);
}
function cg_in(event) {
    if (event == bt[0]) {
        text2.classList.remove('text_cg');
        text2.classList.remove('fad');
        text1.classList.add('text_cg');
        text1.classList.add('fad');
        bt[0].classList.add('userlv_cg');
        bt[1].classList.remove('userlv_cg');
    } else {
        text1.classList.remove('text_cg');
        text1.classList.remove('fad');
        text2.classList.add('text_cg');
        text2.classList.add('fad');
        bt[1].classList.add('userlv_cg');
        bt[0].classList.remove('userlv_cg');
    }

}
slider.addEventListener('mousewheel', (e) => sliderAction(e));
slider.addEventListener('click', function (e) {
    let target = e.target || window.event.target;
    // let flag = 0;
    // event.on('listShow',function(){flag = 1;})
    searchParentByClass(target, 'passageItem', function (elem) {
        let id = elem.getAttribute('data-itemId');
        // if(flag == 0){
        //     return;
        // }
        ajax(ip + 'showPassage', 'post', JSON.stringify({ passage_id: id }), function (data) {
            let res = data.srcElement;
            if (res.readyState == 4) {
                let passageInfo = JSON.parse(res.response);
                let contentBox = document.querySelector('.contentBox')
                contentBox.innerHTML = '<h2>' + passageInfo.title + '</h2>' + passageInfo.content;
            }
        })
    });
})
event.on('create', function (data) {
    if (data.flag != 1) {
        return;
    }
    document.getElementById('login').addEventListener('click', function () {
        var login = {
            // userLevel: userLevel,
            userAccount: document.getElementById('useraccount').value,
            password: document.getElementById('password').value
        }
        login = JSON.stringify(login);
        ajax(ip + 'login', 'post', login, (data1) => {
            if (data1.srcElement.readyState == 4) {
                animationSolve(data, data1);
            }
        });
    });
    bt[0].addEventListener('click', function () {
        ajax(ip + 'login', 'post', null, (data1) => {
            if (data1.srcElement.readyState == 4) {
                animationSolve(data, data1);
            }
        })
    })
    document.getElementById('register').addEventListener('click', function () {
        ajax(ip + 'getRegister', 'get', login, (data1) => {
            if (data1.srcElement.readyState == 4) {
                data.user.innerHTML = data1.srcElement.response;
                event.emit('registerCreated', { flag: 1 });
            }
        });
    });
});
event.on('registerCreated', function () {
    let text1=document.getElementById('password');
    let text2=document.getElementById('rePassword');
    text2.onblur=function(){
        if(text1.value==text2.value){
            text1.classList.remove('register_cg');
            text2.classList.remove('register_cg');
        }else{
            text1.classList.add('register_cg');
            text2.classList.add('register_cg');
        }
    }
    text1.onblur=function(){
        if(text1.value==text2.value){
            text1.classList.remove('register_cg');
            text2.classList.remove('register_cg');
        }else{
            text1.classList.add('register_cg');
            text2.classList.add('register_cg');
        }
    }
    document.getElementById('userRegister').addEventListener('click', function () {
        let registerData = {
        user_name: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        iphone:document.getElementById('phone').value,
        user_level: 1,
        user_g: 0,
        }
        let Data=JSON.stringify(registerData);
        ajax(ip+'register','post',Data,function(data){
            let state = data.srcElement.readyState;
            if(state==4){
               let datas = JSON.parse(data.srcElement.response);
                if(datas.flag==1){
                    console.log('注册成功！');
                }else{
                    
                    console.log('注册失败！'+datas.flag);
                }
            }
        })
    })
    document.getElementById('cancel').onclick=function(){
        login();
    }
});
event.on('listshow', function (flag) {
    if (flag.success != 1) {
        return;
    }
    event.emit('authorLogin', { flag: flag.flag });
    let contentBox = document.querySelector('.contentBox');
    ajax(ip + 'titleList', 'post', null, (data) => {
        let state = data.srcElement.readyState;
        if (state == 4) {
            let content = JSON.parse(data.srcElement.response);
            let itemNum = 0;
            console.log(content)
            let cycleTimer = setInterval(() => {
                if (itemNum == content.length) {
                    clearTimeout(cycleTimer);
                    return;
                }
                createListItem(content, itemNum, cycleTimer)
                itemNum++;
            }, 200);

        }
    });
    contentBox.addEventListener('click', function () {
        if (typeof window.getSelection == 'undefined') {
            alert('浏览器不支持');
            return;
        }
        let thisPlace = window.getSelection();
        cursortPosition = thisPlace.focusNode.parentElement;
    });
});
event.on('authorLogin', function (data) {
    let contentBox = document.querySelector('.contentBox');
    let title = document.getElementById('title');
    let kind = document.getElementById('passageKind');
    let submit = document.getElementById('submit');
    let cache = document.getElementById('cache');
    let deleteBtn = document.getElementById('delete');
    if (data.flag == 0) {
        contentBox.setAttribute('contenteditable', 'false');
        title.setAttribute('contenteditable', 'false');
        return;
    }

    let uploadImg = document.getElementById('uploadImg');
    uploadImg.addEventListener('change', function () {
        let file = uploadImg.files[0];
        let fileReader = new FileReader();
        let img = document.createElement('img');
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            img.setAttribute('src', fileReader.result);
            cursortPosition = cursortPosition === null ? contentBox : cursortPosition;
            cursortPosition.appendChild(img);
            ajax(ip + 'uploadImg', 'post', JSON.stringify({ file: fileReader.result }), function (data) {
                if (data.srcElement.readyState == 4) {
                    img.setAttribute('src', JSON.parse(data.srcElement.response).path);
                }
            })
        }

    });
    submit.addEventListener('click', function () {
        let uploadInfo = {
            passage_title: title.innerHTML.replace(/\s*/, ''),
            passage_content: contentBox.innerHTML,
            passage_kind: kind.value == '' ? kind.value : 'normal',
            user_id: getCookieItem('user_id')
        }
        uploadInfo = JSON.stringify(uploadInfo);
        ajax(ip + 'setPassage', 'post', uploadInfo, function (data) {
            console.log('finish');
        });
    });
    contentBox.addEventListener('keydown', (e) => debouncing(setTitle, 500))
});
function setTitle(e) {
    let event = e || window.event;
    console.log(event.keycode);
}
bt[1].addEventListener('click', function () {
    bt[0].classList.add('disper');
    bt[1].classList.add('slid');
    let a1;
    clearTimeout(a1);
    a1 = setTimeout(function () {
        bt[0].classList.add('userlv_none');
        document.querySelector('.select').classList.add('select_cg');
    }, 1016)
});
event.on('search_cg', function () {
    document.querySelector('.search_cg').addEventListener('click', function () {
        let passage_msg = document.querySelector('.in_cg').value;
        let json={'passage_msg':passage_msg}
        json=JSON.stringify(json);
        ajax(ip + 'searchPassage', 'post', json, (data) => {
            let state = data.srcElement.readyState;
            if (state == 4) {
                let content = JSON.parse(data.srcElement.response);
                let itemNum = 0;
                console.log(content)
                let cycleTimer = setInterval(() => {
                    createListItem(content, itemNum, cycleTimer);
                    itemNum++;
                }, 200);

            }
        });
    });
});

