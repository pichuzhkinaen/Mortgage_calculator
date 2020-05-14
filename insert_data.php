<?php

$rate = $_POST['rate'];
$contrib =  $_POST['contrib'];

if (isset($_POST['rate'], $_POST['contrib'])) { // isset - проверка существования переменных

      // соединение с БД
      $servername = "localhost";
      $database = "mortgagebase";
      $username = "mysql";
      $password = "mysql";

      $conn = mysqli_connect($servername, $username, $password, $database);

      //проверка соединения с базой данных
      if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
      } else {
            //добавление данных в таблицу
            $sql = "INSERT INTO mortgagecalc (percent_rate, percent_contribution) VALUES (?, ?)";

            if($stmt = mysqli_prepare($conn, $sql)){
                  // Привязка переменных к подготовленному выражению в качестве параметров
                  mysqli_stmt_bind_param($stmt, "ii", $percent_rate, $percent_contribution);
                  
                  // Установка значения параметров и выполннение заявления снова, чтобы вставить другую строку
                  $percent_rate = $rate;
                  $percent_contribution = $contrib;
                  mysqli_stmt_execute($stmt);

                  echo "OK";
            }
      }
      
      //echo "Connected successfully\n";
}
// если переменные не существуют, то выполняем следующее
else {
      echo 'Error: Данные отсутствуют';
}
?>