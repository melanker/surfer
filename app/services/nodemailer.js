var nodemailer = require('nodemailer'),
    Q = require('q');


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
        var deferred = Q.defer();

        smtpTransport.sendMail({
            from: obj.from, //obj.from,
            to: 'israelwaves@gmail.com',
            subject: obj.from + ", " +  obj.title,
            text: obj.text
        }, function(err, responseStatus) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(responseStatus);
            }
        });

        return deferred.promise;
    }

};