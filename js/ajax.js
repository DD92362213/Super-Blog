function ajax(url, method, data, callback) {
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open(method, url, true);
    xmlHTTP.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xmlHTTP.setRequestHeader("Access-Control-Allow-Credentials", "true")
    xmlHTTP.send(data);
    xmlHTTP.onreadystatechange = callback
}