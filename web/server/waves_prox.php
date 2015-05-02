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

    if ($_GET["place"] === "ashdod") {
        echo file_get_contents("ashdod.txt");
    } else {
        echo file_get_contents("haifa.txt");
    }