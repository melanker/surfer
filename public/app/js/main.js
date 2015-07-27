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
    var controller, initMainCity, cityArr, graph, main, logoJq, navJq, animationFlag = false;

    logoJq = $(".logo");
    navJq = $(".nav");
    // init controller
    controller = new ScrollMagic.Controller({globalSceneOptions: {}});

    initMainCity = function(name) {
        if ((webApp.charts[name + "Data"].data)) {return;}

        main = new webApp.Main();
        main.getData("/api/waves/" + name).then(function (res) {
            webApp.charts[name + "Data"].data = res.data;
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
    new ScrollMagic.Scene({triggerElement: "#Nahariya", duration: "120%"})
        .setClassToggle(".nahariya", "active")
        .addTo(controller)
        .addIndicators();
    new ScrollMagic.Scene({triggerElement: "#Haifa", duration: "120%"})
        .setClassToggle(".haifa", "active")
        .addTo(controller)
        .addIndicators();
    new ScrollMagic.Scene({triggerElement: "#TelAviv", duration: "120%"})
        .setClassToggle(".telaviv", "active")
        .addTo(controller)
        .addIndicators();
    new ScrollMagic.Scene({triggerElement: "#Ashdod", duration: "120%"})
        .setClassToggle(".ashdod", "active")
        .addTo(controller)
        .addIndicators();
    new ScrollMagic.Scene({triggerElement: "#Netanya", duration: "120%"})
        .setClassToggle(".netanya", "active")
        .addTo(controller)
        .addIndicators();
    new ScrollMagic.Scene({triggerElement: "#Herzliyya", duration: "120%"})
        .setClassToggle(".herzliyya", "active")
        .addTo(controller)
        .addIndicators();


    $(document).scroll(function() {
      if  (($(document).scrollTop() > 0) && !animationFlag) {
        animationFlag = true;
        logoJq.animate({top: "-50px"}, 400, function () {
            logoJq.hide();
        });
        navJq.animate({top: "-50px"}, 400, function () {
            navJq.css({top: "0"});
        });
      }
    if  (($(document).scrollTop() === 0) && animationFlag) {
        animationFlag = false;


        navJq.animate({top: "50px"}, 400, function () {
            navJq.css({top: "0"});
            logoJq.show();
            logoJq.animate({top: "0"}, 400, function () {

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
