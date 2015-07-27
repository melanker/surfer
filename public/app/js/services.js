webApp.communication = {
    http: function (url, method) {
        var deferred = $.Deferred();

        $.ajax({
            url: url,
            crossDomain: true,
            type: method,
            success: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    }
};
