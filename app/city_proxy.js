var communication = require('./services/communication'),
    City = require('./models/city'),
    config = require('../config'),
    mongoAbstract = require('./services/mongoAbstract')(City),
    extend = require('node.extend'),
    cityMap = {
        "Ashdod": "295629",
        "Herzliyya": "294778",
        "TelAviv": "293397",
        "Netanya": "294071",
        "Haifa": "294801",
        "Nahariya": "294117"
    };

var storeData = function(data) {

    var dataJson  =  JSON.parse(data),
        city = new City();

    mongoAbstract.findAndReturnItem({name: dataJson.name}).then(function(result) {
        if (result.length > 0) {
            City.update({name: dataJson.name}, dataJson, function (err, doc){
                if (err) {
                    console.log(err);
                }
            });
        } else {
            extend(true, city, dataJson);
            city.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        console.log(err);
                    else
                        console.log(err);
                }
            });
        }
    });
};


module.exports = {
    updateCityWeather: function(city) {
        communication.httpGet("http://api.openweathermap.org/data/2.5/weather?id=" + cityMap[city] + "&units=metric").then(function(data) {
            storeData(data);
        })},
    cityMap: cityMap
};