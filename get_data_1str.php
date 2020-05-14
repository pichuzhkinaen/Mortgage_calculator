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

//получение последней строки из БД
$sql = 'SELECT percent_rate, percent_contribution FROM mortgagecalc ORDER BY date_added DESC LIMIT 1';

$percent_rate = 0;
$percent_contribution = 0;

if($stmt = mysqli_prepare($conn, $sql)){

    if($res = mysqli_stmt_execute($stmt)) {
        mysqli_stmt_bind_result($stmt, $percent_rate, $percent_contribution);

        mysqli_stmt_fetch($stmt);

        $arr = array('percent_rate' => $percent_rate, 'percent_contribution' => $percent_contribution);

        mysqli_stmt_close($stmt);

        $js_obj = '';
        $js_obj = json_encode($arr);
        printf("%s", $js_obj);
        //echo $js_obj;
        //echo "\n";
    }
}
?>