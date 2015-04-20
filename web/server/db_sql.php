<?php

use PDO;

class DBMySql {

    private $host;
    private $user;
    private $password;
    private $db_name;
    private $port;

    private $connection;


    /** Constructor sets the object of DB_MySQL*/
    public function __construct($host, $port, $user, $password, $db_name) {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->password = $password;
        $this->db_name = $db_name;

        $this->connect();
    }



    private function connect() {
        try {
            $this->connection = new PDO("mysql:host=$this->host;port=$this->port;dbname=$this->db_name", $this->user, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    /**getFromDB($statement) gets information from DB*/

    public function getFromDB($query) {

        try {
            $resp = $this->connection->query($query)->fetch(PDO::FETCH_ASSOC);
            return $resp;
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }

    }

    /**getFromDB($statement) gets information from DB*/

    public function updateDB($query) {

        try {
            $resp = $this->connection->query($query);
            return $resp;
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }

    }


        /**getFromDB($statement) gets information from DB*/

    public function execute($query) {
        try {
            $con = new PDO("mysql:host=$this->host;port=$this->port;dbname=$this->db_name", $this->user, $this->password);
            $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }

        try {
            $resp = $con->exec($query);
            return $resp;
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

}


?>