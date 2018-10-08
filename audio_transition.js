var AipSpeech = require("baidu-aip-sdk").speech;
// 设置APPID/AK/SK
var APP_ID = "14362132";
var API_KEY = "YKAmsojRHIjZE5Aq1nyCzCb4";
var SECRET_KEY = "o5M8yrCXxR06txE0Ca54vtCkHBI5Nlsj";
var client = new AipSpeech(APP_ID, API_KEY, SECRET_KEY);
var fs = require('fs');
let voice = fs.readFileSync(__dirname+'/792634614/test1.wav');
let voiceBuffer = Buffer.from(voice);

// 识别本地文件，附带参数
client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
    console.log('<recognize>: ' + JSON.stringify(result));
}, function(err) {
    console.log(err);
});
module.exports = {
    client:client
}