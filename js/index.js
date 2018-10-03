var ip = 'http://127.0.0.1:3020/';
var event = new eventEmitter(); //from ajax.js
let animationSolve = (data, data1) => {
    if (data1.srcElement.readyState == 4) {
        console.log(data1.srcElement)
        if (getCookieItem('loginFlag') == '1') {
            let container = document.querySelector('.container');
            let callBox = document.querySelector('.callBox');
            let userInfo = document.querySelector('.userInfo');
            let passageList = document.querySelector('.passageList');
            // window.location.href = ip + 'index'
            // console.log(data.element)
            callBox.classList.add('callBoxLogin');
            container.classList.add('loginAnimation');
            // userInfo.classList.add('userInfoLogin');
            setTimeout(function () {
                container.classList.add('loginFinish');
                callBox.classList.remove('callBoxLogin');
                callBox.classList.add('callBoxLogined');
                passageList.classList.remove('hiddenList')
                data.right.innerHTML = '<div class="contentBox">' + data1.srcElement.response + '</div>';
            }, 750);
        }
    }
}
ajax(ip + "getLogin", 'get', null, function (data) {
    let user = document.querySelector('.user');
    let right = document.querySelector('.right');
    let left = document.querySelector('.left');
    if (data.srcElement.readyState == 4) {
        user.innerHTML = data.srcElement.response;
        event.emit('create', { flag: 1, right: right });
    }
});
event.on('create', function (data) {
    if (data.flag == 1) {
        document.getElementById('login').addEventListener('click', function () {
            var login = {
                userAccount: document.getElementById('useraccount').value,
                password: document.getElementById('password').value
            }
            login = JSON.stringify(login);
            ajax(ip + 'login', 'post', login, (data1) => animationSolve(data, data1));
        });
    }
});
const slider = document.querySelector('.sliderBox');
function sliderAction(e) {
    let timer = undefined;
    clearTimeout(timer);
    timer = setTimeout(function () {
        let top = slider.offsetTop;
        let _delta = parseInt(e.wheelDelta);
        if (slider.style.marginTop) {
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
        } else {
            slider.style.marginTop = (top - 10) + 'px';
        }
    }, 16);
}
slider.addEventListener('mousewheel', (e) => sliderAction(e));

document.querySelector('.text1').classList.add('fad');
document.querySelector('.text1').classList.add('visitor_cg');
document.querySelector('.text1').classList.remove('visitor');
document.getElementById('bt1').onmouseover = function () {
    document.querySelector('.text1').classList.add('fad');
    document.querySelector('.text1').classList.add('visitor_cg');
    document.querySelector('.text1').classList.remove('visitor');
}
document.getElementById('bt1').onmouseout = function () {
    document.querySelector('.text1').classList.remove('fad');
    document.querySelector('.text1').classList.remove('visitor_cg');
    document.querySelector('.text1').classList.add('visitor');
    document.querySelector('.visimg').classList.remove('visimg2');
}
document.getElementById('bt2').onmouseover = function () {
    document.querySelector('.text2').classList.add('fad');
    document.querySelector('.text2').classList.add('visitor_cg');
    document.querySelector('.text2').classList.remove('leaguer');
}
document.getElementById('bt2').onmouseout = function () {
    document.querySelector('.text2').classList.remove('fad');
    document.querySelector('.text2').classList.remove('visitor_cg');
    document.querySelector('.text2').classList.add('leaguer');
}
// ----------------------------------------------------------------------------
document.getElementById('bt2').onclick = function () {
    document.querySelector('.visimg').classList.add('fadeOut');

    document.querySelector('.leaimg').classList.add('slid');
    setTimeout(() => {
        document.querySelector('.visimg').classList.remove('vis_img');
        document.querySelector('.visimg').classList.add('visimg1');
        document.querySelector('.select0').classList.remove('select');
        document.querySelector('.select0').classList.add('select1');
        document.querySelector('.leaimg').classList.add('lea_img1');
    }, 1000);

}