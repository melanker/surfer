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
                console.log("DATA", scope.$eval("data"));

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
            })
        }
    };
});