<?php

    function httpGet($url) {
        $headers = array(
            "Cache-Control: no-cache",
        );

        $ch = curl_init();

        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $output=curl_exec($ch);

        curl_close($ch);
        return $output;
    }

    if ($_GET["place"] == "ashdod") {
        $str = httpGet("http://www.israports.co.il/_layouts/IsraelPorts/WaveHeight/Ashdodw-ipa.html");
    } else {
        $str = httpGet("http://www.israports.co.il/_layouts/IsraelPorts/WaveHeight/Haifaw-ipa.html");
    }
    echo $str;