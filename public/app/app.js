var webApp = {
    idAndClassesMap: {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus"
    },
    charts: {
        ashdodData: {
            title: "אשדוד",
            day: "",
            data: null
        },
        haifaData: {
            title: "חיפה",
            day: "",
            data: null
        }
    }
};

$(function () {
    var controller, initMainCity, cityArr, graph, main, logoJq, navJq, docJq, jqMap, template, deferreds, loadingJq, animationFlag = false;

    deferreds  = [];
    loadingJq = $('.loading');
    template = $('.hiddenTemplate').html();
    docJq = $(document);
    logoJq = $(".logo");
    navJq = $(".nav");
    jqMap = {
        haifaStatusJq: $(".haifaStatus"),
        ashdodStatusJq: $(".ashdodStatus"),
        haifaChartJq: $("#haifaChart"),
        ashdodChartJq: $("#ashdodChart")
    };
    cityArr = ["Nahariya", "Haifa", "Netanya", "Herzliyya", "TelAviv", "Ashdod"];

    jqMap.ashdodStatusJq.hide();
    jqMap.haifaChartJq.hide();
    jqMap.haifaStatusJq.hide();
    jqMap.ashdodChartJq.hide();
    // init controller
    controller = new ScrollMagic.Controller({globalSceneOptions: {}});

    initMainCity = function(name) {
        if ((webApp.charts[name + "Data"].data)) {return;}
        var deferred = $.Deferred();

        deferreds.push(deferred.promise());
        main = new webApp.Main();
        main.getData("/api/waves/" + name).then(function (res) {
            webApp.charts[name + "Data"].data = res.data;
            main.setCity(name);
            graph = new webApp.Graph(name);
            deferred.resolve(res.data);
        });
        $.when.apply($, deferreds).then(function () {
            loadingJq.hide();
            jqMap[name + "StatusJq"].fadeIn(600);
            jqMap[name + "ChartJq"].fadeIn(600);
        });
    };

    // build scenes
    new ScrollMagic.Scene({triggerElement: "#main", duration: "200%"})
        .setClassToggle(".main", "active")
        .addTo(controller)
        .on("enter", function () {
            initMainCity("ashdod");
            initMainCity("haifa");
        })
        .addIndicators();

    $.each(cityArr, function(index, cell) {
        var city = new webApp.City(cell);
        var duration = index === 5 ? "100%" : "120%";
        $("#"+ cell).append(template);

        new ScrollMagic.Scene({triggerElement: "#" + cell, duration: duration})
            .setClassToggle("." + cell, "active")
            .addTo(controller)
            .on("enter", function () {
                if (!webApp.charts.ashdodData.data || !webApp.charts.haifaData.data) {
                    window.scrollTo(0, 0);
                    return;
                }
                if (city.dataObj) {return;}
                city.initCity();
            })
            .addIndicators();
    });


    docJq.scroll(function() {
      if  ((docJq.scrollTop() > 0) && !animationFlag) {
        animationFlag = true;
        logoJq.animate({top: "-50px"}, 400, function () {
            logoJq.hide();
        });
        navJq.animate({top: "-50px"}, 400, function () {
            navJq.css({top: "0"});
        });
      }
    if  ((docJq.scrollTop() === 0) && animationFlag) {
        animationFlag = false;
        navJq.animate({top: "50px"}, 400, function () {
            navJq.css({top: "0"});
            logoJq.show();
            logoJq.animate({top: "0"}, 300, function () {

            });
        });
    }
      //  console.log($(document).scrollTop());
    });
    // change behaviour of controller to animate scroll instead of jump

    controller.scrollTo(function (newpos) {
        TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
    });

    //  bind scroll to anchor links
    $(document).on("click", "a[href^='#']", function (e) {
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            e.preventDefault();
            // trigger scroll
            controller.scrollTo(id);
            // if supported by the browser we can even update the URL.
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });

});
