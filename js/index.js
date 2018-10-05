var ip = 'http://127.0.0.1:3020/';
var event = new eventEmitter(); //from ajax.js
const slider = document.querySelector('.sliderBox');
let animationSolve = (data, data1) => {
    if (data1.srcElement.readyState == 4) {
        if (getCookieItem('loginFlag') == '1') {
            let container = document.querySelector('.container');
            let callBox = document.querySelector('.callBox');
            let userInfo = document.querySelector('.userInfo');
            let passageList = document.querySelector('.passageList');
            callBox.classList.add('callBoxLogin');
            container.classList.add('loginAnimation');
            // container.onanimationend = () => container.classList.add('loginFinish');
            // callBox.onanimationend = () =>{
            //     callBox.classList.remove('callBoxLogin');
            //     callBox.classList.add('callBoxLogined');
            // }
            // passageList.onanimationend = () =>{
            //     passageList.classList.remove('hiddenList')
            //     data.right.innerHTML = '<div class="contentBox">' + data1.srcElement.response + '</div>';
            // }
            setTimeout(function () {
                container.classList.add('loginFinish');
                callBox.classList.remove('callBoxLogin');
                callBox.classList.add('callBoxLogined');
                passageList.classList.remove('hiddenList')
                data.right.innerHTML =
                    `<div class="contentBox" contenteditable="true">
                    ${data1.srcElement.response}
                    <footer>
                    <nav>
                        <div>
                            <input type="file" />
                        </div>
                    </nav>
                </footer>
                </div>`;
                event.emit('listshow', { success: 1 });
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
                // userLevel: userLevel,
                userAccount: document.getElementById('useraccount').value,
                password: document.getElementById('password').value
            }
            login = JSON.stringify(login);
            ajax(ip + 'login', 'post', login, (data1) => {
                animationSolve(data, data1)
            });
        });
    }
});
function createListItem(content, i) {
    let itemTemplate = document.createElement('div');
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
    <span style="flex:3">${content[i].passage_date}</span>
    <span>${content[i].passage_good}</span>
    <span>${content[i].passage_see}</span>
</div>`
    itemTemplate.innerHTML = itemContent;
    slider.appendChild(itemTemplate);
}
event.on('listshow', function (flag) {
    if (flag.success == 1) {
        ajax(ip + 'titleList', 'post', null, (data) => {
            let state = data.srcElement.readyState;
            if (state == 4) {
                let content = JSON.parse(data.srcElement.response);
                let itemNum = 0;
                let cycleTimer = setInterval(() => {
                    itemNum++;
                    if (itemNum < content.length) {
                        createListItem(content,itemNum)
                    } else {
                        clearInterval(cycleTimer);
                    }
                }, 200);

            }
        })
    }
})
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
    document.querySelector('.text1').classList.remove('fad');
    document.querySelector('.text1').classList.remove('visitor_cg');
    document.querySelector('.text1').classList.add('visitor');
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
    userLevel = 1;
    document.querySelector('.leaimg').classList.add('slid');
    setTimeout(() => {
        document.querySelector('.visimg').classList.remove('vis_img');
        document.querySelector('.visimg').classList.add('visimg1');
        document.querySelector('.select0').classList.remove('select');
        document.querySelector('.select0').classList.add('select1');
        document.querySelector('.leaimg').classList.add('lea_img1');
    }, 1000);

}