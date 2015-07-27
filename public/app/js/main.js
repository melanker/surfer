$(function (){
    // init controller
    var controller = new ScrollMagic.Controller({globalSceneOptions: {}});

    // build scenes
    new ScrollMagic.Scene({triggerElement: "#main", duration: "200%"})
        .setClassToggle(".main", "active")
        .addTo(controller)
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
