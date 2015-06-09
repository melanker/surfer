var communication = require('./services/communication.js'),
    Wave = require('./models/wave.js'),
    config = require('../config'),
    $ = require('cheerio'),
    mongoose = require('mongoose'),
    propArr = ["time", "hMax", "hS", "hThird", "direction", "tAv", "tZ", "tP", "temperature"],
    mongoAbstract = require('./services/mongoAbstract.js')(Wave);

var waveHtmlToJson = function(data, city) {
    var parsedHTML = $.load(data),
        dataObj = {};

    dataObj["city"] = city;

    for (var i =0; i < propArr.length; i += 1) {
        dataObj[propArr[i]] = [];
    }

    parsedHTML('center b font font').each(function(key, title) {
        dataObj["date"] = $(title).text();
        return false;
    });

    parsedHTML('table').each(function(index, table) {
        if (index === 1) {return false;} //run only for first table (latest day)

        table = $.load(table);
        table('tr').each(function (key, row) {
            if (key !== 0) { //skips title
                row = $.load(row);
                row('td').each(function (i, td) {
                    td = $(td);
                    dataObj[propArr[i]].push(td.text());
                });
            }
        });
    });

    return dataObj;
};

var storeData = function(data) {
    var wave = new Wave();

    mongoose.connect(config.database);

    mongoAbstract.findAndReturnItem({city: data.city}).then(function(result) {
        if (result.length > 0) {
            Wave.update({city: data.city}, data, function (err, doc){
                if (err) {
                    console.log(err);
                }
            });
        } else {
            wave.city = data.city;
            wave.date = data.date;

            for (var i =0; i < propArr.length; i += 1) {
                wave[propArr[i]] = data[propArr[i]];
            }

            wave.save(function(err) {
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
    getCity: function(city) {
        communication.httpGet("http://israelwaves.info/server/waves_prox.php?place=" + city).then(function(data) {
            storeData(waveHtmlToJson(data, city));

    })}
};