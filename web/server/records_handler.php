<?php

include include 'db_sql.php';

/***************Connection details for MYSQL users DB***************************************/
define('DB_users_USER', 'melanker');
define('DB_users_PASS', '70100830a');
define('DB_users_HOST' , 'localhost');
define('DB_users_NAME' , 'weather');
define('DB_users_PORT' , '3306');

/***********START of code *******************************************************************************************/

define("Ashdod", 295629);
define("Herzliyya", 294778);
define("TelAviv" ,293397);
define("Netanya" ,294071);
define("Haifa" ,294801);
define("Nahariya" ,294117);

//spl_autoload_register('RecordContainer\autoloadDB');

function httpGet($url) {
    //  Initiate curl
    $ch = curl_init();
    // Disable SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch,CURLOPT_HEADER, false);
    // Set the url
    curl_setopt($ch, CURLOPT_URL, $url);
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);
    if (json_decode($result)->wind) {
        return $result;
    } else {
      return false;
    }
}

initFunc(Ashdod);
initFunc(Herzliyya);
initFunc(TelAviv);
initFunc(Netanya);
initFunc(Haifa);
initFunc(Nahariya);

function initFunc($city_id) {
    $str = httpGet("api.openweathermap.org/data/2.5/weather?id=" . $city_id . "&units=metric&APPID=65979c59499d18cff77bbcfd2c8bdce6");
    if ($str) {
        insertToTableByCityID($str ,$city_id);
    }
}

/** insertTable(string) insert content of post into db postss*/
function insertToTableByCityID($str, $id) {
    $query = "INSERT INTO  openweather_db (city_id, data) VALUES ('$id', '$str')";
    $GLOBALS['$db_obj'] = new DBMySql(DB_users_HOST,
        DB_users_PORT,
        DB_users_USER,
        DB_users_PASS,
        DB_users_NAME);


    if (checkIfExist($id)) {
        replaceField($id, $str);
    } else {
        if ($GLOBALS['$db_obj'] ->execute($query)) {
            echo 'inserted successfully';
        }
    }
}//end


function checkIfExist($id) {
    $query = "SELECT * FROM openweather_db WHERE city_id=$id";
    if ($GLOBALS['$db_obj'] ->getFromDB($query)) {
        return true;
    } else {
        return false;
    }


}

function recordsLoader() { //start recordsLoader()


    /**@dbObj: MySQL DB object already infused with connection */

    $db_obj = new DBMySql(DB_users_HOST,
                                   DB_users_PORT,
                                   DB_users_USER,
                                   DB_users_PASS,
                                   DB_users_NAME);

    $query = 'SELECT * FROM records';

    $result = $GLOBALS['$db_obj'] ->getFromDB($query);


    //if successfully performed query
    if ($result)
    {//start  if ($result)


        //will hold the records
        $arr = array();
        foreach($result as $row)
        {
            $arr[] = array('rank' => $row['rank'],'content' => $row['content'],'UID' => $row['UID']);

        }//end  while($row = mysqli_fetch_array($result))

        echo json_encode($arr);
    }//end if ($result)
    else throw new Exception('Post Loading Error');

} //end recordsLoader()

/**function replaceField($key,$replacement) for field replacment based on UID */

function replaceField($id, $replacement) {
    $query = "UPDATE openweather_db SET data='$replacement' WHERE city_id='$id'";

    if ($GLOBALS['$db_obj'] -> updateDB($query));
    else throw new Exception('POST EDIT HAS FAILED');
}

/**function replaceField($key,$replacement) for row deletion based on UID */

function deleteRow($key)
{
    /**@dbObj: MySQL DB object already infused with connection */


    $query = "DELETE FROM records WHERE UID='$key'";

    if ($GLOBALS['$db_obj'] -> execute($query))
        echo '[{deleted:1}]';
    else
        throw new Exception("POST DELETE HAS FAILED");

}


?>