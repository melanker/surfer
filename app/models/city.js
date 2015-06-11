// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

citySchema = new Schema ({
    "sys" : {
        "sunrise" : {type: Number},
        "sunset" : {type: Number, required: true}
    },
    "weather" : [{
        "main" : String,
        "description" : String,
        "icon" : {type: String, required: true}
    }
    ],
    "main" : {
        "temp" : {type: Number, required: true},
        "pressure" : {type: Number},
        "humidity" : {type: Number},
        "temp_min" : {type: Number},
        "temp_max" : {type: Number}
    },
    "wind" : {
        "speed" : {type: Number, required: true},
        "deg" : {type: Number, required: true}
    },
    "rain" : {
        "3h" : {type: Number}
    },
    "clouds" : {
        "all" : {type: Number}
    },
    "dt" : {type: Number, required: true},
    "id" : {type: Number, required: true},
    "name" : {type: String, required: true, unique: true},
    "cod" : {type: Number, required: true}
});

module.exports = mongoose.model('City', citySchema);