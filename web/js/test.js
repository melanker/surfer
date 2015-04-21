$(function () {

    $(".send").click(function (){
        alert("CookieBarie CookieBarie .... CookieBarie, CookieBarie CookieBarie ... CookieBarie........... Don't call me CookieBarie!!!");
        $.ajax({
            url: "/server/city_data.php?id='295629'",
            type: "GET",
            success: function (data) {
                console.log(JSON.parse(data));
            },
            error: function(request, status, error) {
                console(error);
            }
        });
    });
});
