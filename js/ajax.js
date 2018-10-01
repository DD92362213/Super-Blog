function ajax(url, method, data, callback) {
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open(method, url, true);
    xmlHTTP.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xmlHTTP.setRequestHeader("Access-Control-Allow-Credentials", "true")
    xmlHTTP.send(data);
    xmlHTTP.onreadystatechange = callback
}
function eventEmitter(){
    if(!this.handler){
        this.handler = {};
    }
}
eventEmitter.prototype.on = function(event,callback){
    if(!this.handler[event]){
        this.handler[event] = [];
    }
    this.handler[event].push(callback);
}
eventEmitter.prototype.emit = function(event,...data){
    console.log(data);
    if(this.handler[event].length != 0){
        this.handler[event].map(function(item){
            item(...data);
        })
    }
}