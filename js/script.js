window.addEventListener('DOMContentLoaded', function() {
	'use strict';

		//получение данных из php (последняя строка БД)
		$.ajax({
			url: "/get_data_1str.php",
			type : "POST",
			success: function (responseText) {
				//console.log('ajax = ' + responseText);
				let result = JSON.parse(responseText, function(key, value) {
					return value;
				});
				//console.log(result);

				main(result);
			}
		});
});


function main(result) {
	let rate = result.percent_rate, //процентная ставка
		contrib = result.percent_contribution; //первоначальный взнос

	// console.log('percent_rate = ' + rate);
	// console.log('percent_contribution = ' + contrib);


	//ежемесячный платеж
	function monthlyPay(rate) {
		let	rateMonth = rate / 100 / 12, //ежемесячная процентная ставка
			rateGeneral = ( 1 + rateMonth )** (($ ( "#slider-range-time" ).slider( "value" ) ) * 12), //общая ставка
			paymentMonth = ($( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" )) * rateMonth * rateGeneral / (rateGeneral - 1), //ежемесячный платеж
			requiredIncome = 50; //необходимый доход ставка

		//запись ставки процента
		$( ".calculation_value-rate" ).html( ( rate ) + " %");

		//запись ежемесячного платежа
		$( ".calculation_value-payment" ).html( Math.round(paymentMonth).toLocaleString( "ru-RU" ) + " ₽" );

		//необходимый доход
		$( ".calculation_value-income" ).html( Math.round( paymentMonth * 100 / requiredIncome ).toLocaleString( "ru-RU" ) + " ₽" );
		//console.log(rate);
		repaymentCalc(rateMonth, paymentMonth);
	}


	//рассчет погашений
	function repaymentCalc(rateMonth, paymentMonth) {
		let mainDebt = $( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" ), //текущий размер основного долга
			creditTerm = $( "#slider-range-time" ).slider( "value" ), //срок
			monthPeriod = creditTerm * 12, //срок в месяцах
			percentMonthlyPay = mainDebt * rateMonth, //процентная часть ежемесячного платежа
			mainMonthlyPay =  paymentMonth - percentMonthlyPay, //основная часть ежемесячного платежа
			arrPercentMonthlyPay = []; //массив с процентной частью ежемесячного платежа

			// процентная и основная часть для каждого месяца
			for (i = 0; i < monthPeriod; i ++) {
				mainDebt = mainDebt - mainMonthlyPay;
				percentMonthlyPay = Math.round( mainDebt * rateMonth ); //процентная часть ежемесячного платежа
				mainMonthlyPay = Math.round( paymentMonth - percentMonthlyPay ); //основная часть ежемесячного платежа

				arrPercentMonthlyPay.push( percentMonthlyPay );
				// console.log("------");
				// console.log("текущий размер основного долга = " + mainDebt);
				// console.log("процентная часть = " + percentMonthlyPay);
				// console.log("основная часть = " + mainMonthlyPay);
			}
		plotting (monthPeriod, arrPercentMonthlyPay, paymentMonth);
	}


	//построение графика
	function plotting (monthPeriod, arrPercentMonthlyPay, paymentMonth) {
		//перенесено в конец, вне функции plotting(), чтобы при движении ползунка отрисовывалось правильно (иначе не работает изменение начала координат)
		// let canvas = document.getElementById("chart");
		// let context = canvas.getContext("2d");
		// context.transform(1, 0, 0, -1, 0, canvas.height);	
		// context.moveTo(0, 0);
		// context.lineTo(200,200);
		stepX = monthPeriod / canvas.clientWidth,
		stepY = paymentMonth / canvas.clientHeight;

		//фон
		context.beginPath();
		context.lineWidth = 1;
		context.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
		context.stroke();

		//заливка фона
		context.fillStyle = "#E3F0FB";
		context.fill();

		//отрисовка графика

		context.beginPath();
		context.strokeStyle = "#007ACC";
		context.lineWidth = 1;

		context.moveTo(0, arrPercentMonthlyPay[0] / stepY); //координаты начальной точки

		//определение координат графика
		for (let i = 0; i < monthPeriod; i++) {
			let y = arrPercentMonthlyPay[i] / stepY,
				x = i / stepX;
			context.lineTo(x, y);
			//console.log('x = ' + x, 'y = ' + y, 'PercentMonthlyPay = ' + arrPercentMonthlyPay[i]);
		}
		context.lineTo(0,0);
		context.stroke();
		
		//заливка графика	
		context.fillStyle = "#A2DA95";
		context.fill();
	}
	

	//склонение слова "год"
	function years(n) {  
		let arr = ['год', 'года', 'лет'];
		n = Math.abs(n) % 100; 
		let n1 = n % 10;
        if (n > 10 && n < 20) { return arr[2]; }
        if (n1 > 1 && n1 < 5) { return arr[1]; }
        if (n1 == 1) { return arr[0]; }
        return arr[2];
    }


	//radio button
	$("#flat").focus(function(){
		$(".flat").addClass("active");
		$(".home").removeClass("active");
	});
	$("#home").focus(function(){
		$(".flat").removeClass("active");
		$(".home").addClass("active");
	});	

	
	let totalPrice = 2000000,
		firstAmount = 0;

	// 1, стоимость недвижимости
	$("#slider-range").slider({
		range: "min",
		min: 300000,
		max: 30000000,
		value: totalPrice,
		slide: function( event, ui ) {

			$( "#amount" ).val( ui.value.toLocaleString( "ru-RU" ) + " ₽" ); //добавление знач. в первый инпут, добавление пробелов после 3х знаков

			totalPrice = Math.round (ui.value); //округление до ближайшего целого значения ползунка
			firstAmount = Math.round (totalPrice * contrib / 100); //округление до ближайшего целого значения первонач. взноса

			$( "#amount-contribution" ).val( firstAmount.toLocaleString( "ru-RU" ) + " ₽"  ); //добавление знач. во второй инпут
		
			$( "#slider-range-contribution" ).slider('option',{min: firstAmount}); //минимальное значение второго слайдера равно 15% от первонач. взноса
			$( "#slider-range-contribution" ).slider('option',{max: totalPrice}); //максимальное значение второго слайдера равно значению первого слайдера
			$( "#slider-range-contribution" ).slider( "value", firstAmount);
			$( "#percents" ).html(((firstAmount ) / ( totalPrice) * 100).toFixed(1) + " %" ); //расчет процентов при движении первого ползунка
			monthlyPay(rate);
		}
	});
	

	$( "#amount" ).val( $( "#slider-range" ).slider( "value" ).toLocaleString( "ru-RU" ) + " ₽"); //добавление в первый инпут значения при загрузке страницы


	// 2, первоначальный взнос
	$("#slider-range-contribution").slider({
		range: "min",
		min: 100,
		max: 30000000,
		value: Math.round (totalPrice * contrib / 100),
		slide: function( event, ui ) {

			$( "#amount-contribution" ).val( ui.value.toLocaleString( "ru-RU" ) + " ₽" ); //добавление знач. во второй инпут, добавление пробелов после 3х знаков
			$( "#percents" ).html((( ui.value ) / ( $( "#slider-range" ).slider( "value" )) * 100).toFixed(1) + " %" ); //расчет процентов при движении второго ползунка
			// $( "#percents" ).html('option',{min: contrib});

			monthlyPay(rate);
		}
	});


	$( "#amount-contribution" ).val( $( "#slider-range-contribution" ).slider( "value" ).toLocaleString( "ru-RU" ) + " ₽"); //добавление во второй инпут значения при загрузке страницы
	$( "#slider-range-contribution" ).slider('option',{max: 2000000}); //установка мин знач второго слайдера при загрузке стр
	$( "#slider-range-contribution" ).slider('option',{min: Math.round (totalPrice * contrib / 100)}); //установка макс знач второго слайдера при загрузке стр
	$( "#percents" ).html( ($( "#slider-range-contribution" ).slider( "value" ) / ( $( "#slider-range" ).slider( "value" )) * 100).toFixed(1) + " %" ); //расчет процентов при загрузке стр


	// 3, срок кредита
	$( "#slider-range-time" ).slider({
		range: "min",
		min: 1,
		max: 30,
		value: 15,
		slide: function( event, ui ) {
			//подстановка функции склонения лет и запись значения в инпут
			$( "#amount-time" ).val(ui.value + ' ' + years(ui.value));
			monthlyPay(rate);
		}
	});


	$( "#amount-time" ).val( $( "#slider-range-time" ).slider( "value" ) + " лет"); //добавление в третий инпут значения при загрузке страницы


	//сумма кредита
	$( ".calculation_value-sum" ).html(( $( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" )).toLocaleString( "ru-RU" ) + " ₽"); 		


	//перенесено в конец, вне функции plotting(), чтобы при движении ползунка отрисовывалось правильно (иначе не работает изменение начала координат)
	let canvas = document.getElementById("chart");
	let context = canvas.getContext("2d");
	context.transform(1, 0, 0, -1, 0, canvas.height);	


	//ежемесячный платеж
	monthlyPay(rate);
};
