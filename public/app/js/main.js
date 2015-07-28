var webApp = {
    idAndClassesMap: {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus"
    },
    charts: {
        ashdodData: {
            loadingJq: $(".ashdodLoading"),
            title: "אשדוד",
            day: "",
            data: null
        },
        haifaData: {
            loadingJq: $(".haifaLoading"),
            title: "חיפה",
            day: "",
            data: null
        }
    }
};


$(function () {
    var controller, initMainCity, cityArr, graph, main, logoJq, navJq, docJq, jqMap, template, animationFlag = false;

    template = $('.hiddenTemplate').html();
    docJq = $(document);
    logoJq = $(".logo");
    navJq = $(".nav");
    jqMap = {
        haifaStatusJq: $(".haifaStatus"),
        ashdodStatusJq: $(".ashdodStatus")
    };
    cityArr = ["Nahariya", "Haifa", "Netanya", "Herzliyya", "TelAviv", "Ashdod"];

    haifaStatusJq = $(".haifaStatus").hide();
    ashdodStatusJq = $(".ashdodStatus").hide();
    // init controller
    controller = new ScrollMagic.Controller({globalSceneOptions: {}});

    initMainCity = function(name) {
        if ((webApp.charts[name + "Data"].data)) {return;}

        main = new webApp.Main();
        main.getData("/api/waves/" + name).then(function (res) {
            jqMap[name + "StatusJq"].fadeIn(600);
            webApp.charts[name + "Data"].data = res.data;
            main.setCity(name);
            graph = new webApp.Graph(name);
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
        var duration = index === 5 ? "" : "120%"
        $("#"+ cell).append(template);

        new ScrollMagic.Scene({triggerElement: "#" + cell, duration: duration})
            .setClassToggle("." + cell, "active")
            .addTo(controller)
            .on("enter", function () {
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
