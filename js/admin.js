window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    let submit = document.getElementById('submit');

    submit.addEventListener('click', function() {
        event.preventDefault();
        let rate = document.getElementById('percent-rate').value,
            contrib = document.getElementById('percent-contribution').value;

        //вызов файла php методом POST и отправка данных на сервер
        $.ajax({
            url: "/insert_data.php",
            type : "POST",
            data : {'rate': rate, 'contrib': contrib},
            success: function (responseText) {
                //console.log(responseText);
            }
        });

        //очистка инпутов
        let input1 = document.getElementById('percent-rate').value = '',
            input2 = document.getElementById('percent-contribution').value = '';       
    });


    //отправка данных в таблицу
    $.ajax({
        url: "/get_data_all.php",
        type : "POST",
        success: function (responseText) {

            let result = JSON.parse(responseText, function(key, value) {
                return value;
            });

            createHistoryTable(result);
            }
        });
});


//создание таблицы и запись данных
function createHistoryTable(result) {
    let table = document.querySelector('.table'),
        areaStringCount = result.length, //количество строк
        areaCellCount = 3; //количество ячеек
    //сoздание строк и ячеек в них
    for (let a = 0; a < areaStringCount; a++) {
        let string = document.createElement('tr');

        string.className = 'table_string';
        table.appendChild(string);

        //альтернативный вариант записи данных
        // for (let prop in obj) {
        //     console.log(prop + ' = ' + obj[prop]);
        //     let cell = document.createElement('td');
        //     cell.className = 'table_cell';
        //     string.appendChild(cell);

        //     cell.innerHTML = obj[prop]; 
        // }

        for (let b = 0; b < areaCellCount; b++) {
            let cell = document.createElement('td');

            cell.className = 'table_cell';
            string.appendChild(cell);

            //запись данных
            let obj = result[a],
                objIter = Object.values(obj);

            //console.log(objIter[b]);

            cell.innerHTML = objIter[b];
        }
    }
};
