var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'israelwaves@gmail.com',
        pass: ''
    }
});
    // An example users object with formatted email function
    var locals = {
        email: 'israelwaves@gmail.com'
    };


module.exports = {


    sendMail: function(obj) {
        smtpTransport.sendMail({
            from: obj.from, //obj.from,
            to: 'israelwaves@gmail.com',
            subject: obj.from + ", " +  obj.title,
            text: obj.text
        }, function(err, responseStatus) {
            if (err) {
                res.json(err);
            } else {
                res.json(responseStatus);
            }
        });
    }


};