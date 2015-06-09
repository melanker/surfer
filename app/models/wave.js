// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

waveSchema = new Schema ({
    city: { type: String, required: true, unique: true },
    date: { type: String, required: true},
    time: { type: Array, required: true},
    hMax: { type: Array, required: true},
    hS: { type: Array, required: true},
    hThird: { type: Array, required: true},
    direction: { type: Array, required: true},
    tAv: { type: Array, required: true},
    tZ: { type: Array, required: true},
    tP: { type: Array, required: true},
    temperature: { type: Array, required: true}
});

module.exports = mongoose.model('Wave', waveSchema);