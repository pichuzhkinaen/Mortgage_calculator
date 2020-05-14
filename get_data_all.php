<?php
// соединение с БД
$servername = "localhost";
$database = "mortgagebase";
$username = "mysql";
$password = "mysql";

$conn = mysqli_connect($servername, $username, $password, $database);
//проверка соединения с базой данных
if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
}
 
//echo "Connected successfully\n";


//получение всех данных из БД
$sql_all = 'SELECT date_added, percent_rate, percent_contribution FROM mortgagecalc ORDER BY date_added DESC';


if($stmt = mysqli_prepare($conn, $sql_all)) {

    if(mysqli_stmt_execute($stmt)) {
        mysqli_stmt_bind_result($stmt, $date_added, $percent_rate, $percent_contribution);

        $arr_all = array();

        while (mysqli_stmt_fetch($stmt)) {

            $arr = array('date_added' => $date_added, 'percent_rate' => $percent_rate, 'percent_contribution' => $percent_contribution);
            array_push($arr_all, $arr);
        }

        mysqli_stmt_close($stmt);

        $js_table = json_encode($arr_all);
        printf("%s", $js_table);
        //echo "\n";
    }
}

mysqli_close($conn);

?>