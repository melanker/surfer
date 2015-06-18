wavesApp.directive('highChart', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        template: '<div></div>',
        link: function (scope, element) {



            var parseArrIntoFloat = function(arr) {
                var parsedArr = [];

                if (!arr || arr.length === 0) {return [];}

                for (var i=0; i < arr.length; i += 1) {
                    parsedArr.push(parseFloat(arr[i]));
                }

                return parsedArr;
            };

            scope.$watch("data",function (oldVal, newVal) {
                element.highcharts({
                    chart: {
                        type: 'areaspline'
                    },
                    title: {
                        text: (scope.$eval("data.date") || "") + ",  " + (scope.$eval("data.city") ? (scope.$eval("data.city").toUpperCase() === "ASHDOD" ? "אשדוד" : "חיפה") : ""),
                        style: {
                            "color": "#333", "fontSize": "16px", "fontWeight": "bold", "fontFamily": "almoni-dl-regular, Arial"
                        }
                    },
                    xAxis: {
                        categories: scope.$eval("data.time") || []
                    },
                    yAxis: {
                        title: {
                            text: 'Height[meter]'
                        }
                    },
                    tooltip: {
                        shared: true,
                        valueSuffix: ' meter'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        areaspline: {
                            fillOpacity: 0.5
                        }
                    },
                    series: [{
                        name: 'גל מקסימלי',
                        data: parseArrIntoFloat(scope.$eval("data.hMax")) || []
                    }, {
                        name: 'גל מינימלי',
                        data: parseArrIntoFloat(scope.$eval("data.hS")) || []
                    }]
                });
            });
        }
    };
});


//wavesApp.directive('mailDialog', function($timeout) {
//    return {
//        restrict: 'E',
//        scope: {
//            data: '='
//        },
//        templateUrl: '/public/app/views/pages/mail_dialog.html',
//        link: function (scope, element) {
//            var form = $(element).find('#ajax-contact'),
//                contactMeJq = $(element).find("#contactMe");
//
//            $(form).submit(function(event) {
//                var formData = $(form).serialize();
//                $httpDefer.ajax({url: $(form).attr('action'),method: 'POST',data: $(form).serialize()}).then(function(data) {
//
//                }, function (data) {
//                    var notifyJq = $("#notifyDialog");
//                    setTimeout(function () {notifyJq.modal("show")}, 1000);
//                    notifyJq.find("p").text("בעיה עם שליחת המייל, יתכן והמייל שהזנת לא תקין. נסה שוב");
//                    setTimeout(function () {notifyJq.modal("hide")}, 8000);
//                });
//                contactMeJq.modal('hide');
//                contactMeJq.find("input, textarea").val('');
//                return false;
//            });
//        }
//    };
//});