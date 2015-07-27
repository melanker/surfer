webApp.Main = function() {};

webApp.Main.prototype.getData = function getData(url) {
    return webApp.communication.http(url, "GET");
};


