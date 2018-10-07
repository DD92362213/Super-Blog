function getCookieItem(key){
    let self = this;
    if (document.cookie.length != 0) {
        self.itemStart = document.cookie.indexOf(key + "=");
        if (self.itemStart != -1) {
            self.itemStart += key.length; 
            self.itemEnd = document.cookie.indexOf(";", itemStart+1);
            console.log(self.itemEnd);
            if(self.itemEnd == -1){
                self.itemEnd = itemStart+key.length+1;
            }
            console.log(self.itemStart,self.itemEnd);
            return document.cookie.substring(self.itemStart+1,self.itemEnd);
        }else{
            return undefined;
        }
    }else{
        return null;
    }
}