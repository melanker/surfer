<?php

include 'db_sql.php';

/***************Connection details for MYSQL users DB***************************************/
define('DB_users_USER', 'root');
define('DB_users_PASS', '');
define('DB_users_HOST' , 'localhost');
define('DB_users_NAME' , 'weather');
define('DB_users_PORT' , '3306');
/***********START of code *******************************************************************************************/

function getByKey($id) {
    $query = "SELECT * FROM openweather_db WHERE city_id=$id";
    $resp = $GLOBALS['$db_obj']->getFromDB($query);
    return $resp;
}

if ($_GET["id"]) {
    $GLOBALS['$db_obj'] = new DBMySql(DB_users_HOST,
        DB_users_PORT,
        DB_users_USER,
        DB_users_PASS,
        DB_users_NAME);
    echo json_encode(getByKey($_GET["id"]));
}


