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

    if ((strpos($output,"wave") != false) && (strpos($output,"wind") != false)) {
        return $output;
    } else {
        return false;
    }
}

initFunc();

function initFunc() {
    $ashdod_data = httpGet("http://www.israports.co.il/_layouts/IsraelPorts/WaveHeight/Ashdodw-ipa.html");
    $haifa_data = httpGet("http://www.israports.co.il/_layouts/IsraelPorts/WaveHeight/Haifaw-ipa.html");

    if ($ashdod_data) {
        $ashdod_file = fopen(__DIR__ . "/ashdod.txt", "w")  or die("Unable to open file!");
        fwrite($ashdod_file, $ashdod_data);
    }

    if ($haifa_data) {
        $haifa_file = fopen(__DIR__ . "/haifa.txt", "w")  or die("Unable to open file!");
        fwrite($haifa_file, $haifa_data);
    }
}