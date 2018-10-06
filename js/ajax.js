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
    if(this.handler[event].length != 0){
        this.handler[event].map(function(item){
            item(...data);
        });
    }
}
function debouncing(fn,waitTime){
    let timer = undefined;
    return function(){
        let context = this;
        let arg = arguments;
        clearTimeout(timer);
        timer = setTimeout(function(){
            fn.apply(context,arg);
        },waitTime);
    }
}
function sleep(fn,time){
    let timer = undefined;
    // let result = undefined
    return new Promise((resolve,reject)=>{
        // clearTimeout(timer);
        // result = Promise.resolve();
        timer = setTimeout(function(){
            resolve(timer);
        },time);
        console.log(time)
    }).then((timer)=>{
        // return result.then(()=>{
            fn.apply(this,arguments)
        // })
    })
}
function searchParentByClass(thisEle,parent,fn){
    let classList = [...thisEle.parentElement.classList]; 
    if(classList.includes(parent)){
        if(fn){
            fn.call(this,thisEle.parentElement);
        }
        else{
            return thisEle.parentElement;
        }
    }
    else if(thisEle.parentElement === document){
        return document;
    }
    else{
        searchParentByClass(thisEle.parentElement,parent,fn);
    }
}