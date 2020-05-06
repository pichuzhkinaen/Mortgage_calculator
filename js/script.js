$(document).ready(function() {

	//ежемесячный платеж и необходимый доход
	function monthlyPay() {
		let rate = 9.2, //годовая процентная ставка
			rateMonth = rate / 100 / 12, //ежемесячная процентная ставка
			tmp = ( 1 + rateMonth )** (($ ( "#slider-range-time" ).slider( "value" ) ) * 12),
			paymentMonth = ($( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" )) * rateMonth * tmp / (tmp - 1), //ежемесячный платеж
			requiredIncome = 50; //необходимый доход ставка

		$( ".calculation_value-rate" ).html( ( rate ) + " %");

		$( ".calculation_value-payment" ).html( Math.round(paymentMonth).toLocaleString( "ru-RU" ) + " ₽" );

		//необходимый доход
		
		$( ".calculation_value-income" ).html( Math.round( paymentMonth * 100 / requiredIncome ).toLocaleString( "ru-RU" ) + " ₽" );
		
		repaymentCalc(rateMonth, rate, paymentMonth);
	}

	//рассчет погашений
	function repaymentCalc(rateMonth, rate, paymentMonth) {
		let mainDebt = $( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" ), //текущий размер основного долга
			creditTerm = $( "#slider-range-time" ).slider( "value" ), //срок
			monthPeriod = creditTerm * 12; //срок в месяцах
			percentMonthlyPay = mainDebt * rateMonth; //процентная часть ежемесячного платежа
			//percentMonthlyPay = mainDebt * (rate / 100) * 30 / 365; //процентная часть ежемесячного платежа
			mainMonthlyPay = Math.round( paymentMonth - percentMonthlyPay ), //основная часть ежемесячного платежа
			arrPercentMonthlyPay = []; //массив с процентной частью ежемесячного платежа
			//currentAmount = currentAmount - mainMonthlyPay; //текущий размер основного долга

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
		//console.log(rateMonth, rate, paymentMonth);
		plotting (monthPeriod, arrPercentMonthlyPay, paymentMonth);
		// console.log(mainDebt);
		// console.log(creditTerm);
		// console.log(rateMonth, rate, paymentMonth);
		// console.log(percentMonthlyPay, mainMonthlyPay);
		// console.log(monthPeriod);
	}


	//построение графика
	function plotting (monthPeriod, arrPercentMonthlyPay, paymentMonth) {
		// let canvas = document.getElementById("chart");
		// let context = canvas.getContext("2d");
		// 	context.transform(1, 0, 0, -1, 0, canvas.height);	
			//context.moveTo(0, 0);
			//context.lineTo(200,200);
			stepX = monthPeriod / canvas.clientWidth,
			stepY = paymentMonth / canvas.clientHeight;

		//фон
		
		context.beginPath();
		context.lineWidth = 1;
		context.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
		context.stroke();

		context.fillStyle = "#E3F0FB";
		context.fill();

		context.beginPath();
		context.strokeStyle = "#007ACC";
		context.lineWidth = 1;
		//context.beginPath();
		//context.clearRect(0, 0, canvas.width, canvas.height);
		// context.clearRect();
		context.moveTo(0, arrPercentMonthlyPay[0] / stepY); //координаты начальной точки

		for (let i = 0; i < monthPeriod; i++) {
			let y = arrPercentMonthlyPay[i] / stepY,
				x = i / stepX;
			context.lineTo(x, y);
			//console.log('x = ' + x, 'y = ' + y, 'PercentMonthlyPay = ' + arrPercentMonthlyPay[i]);
		}
		context.lineTo(0,0);
		context.stroke();
		

		//заливка		
		context.fillStyle = "#A2DA95";
		context.fill();
		//console.log(monthPeriod);
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


	//слайдеры и расчет %%
	let totalPrice = 0,
		firstAmount = 0;

	//стоимость недвижимости
	$("#slider-range").slider({
		range: "min",
		min: 300000,
		max: 30000000,
		value: 2000000,
		slide: function( event, ui ) {

			$( "#amount" ).val( ui.value.toLocaleString( "ru-RU" ) + " ₽" ); //добавление знач. в первый инпут, добавление пробелов после 3х знаков

			totalPrice = Math.round (ui.value); //округление до ближайшего целого значения ползунка
			firstAmount = Math.round (totalPrice * 15 / 100); //округление до ближайшего целого значения первонач. взноса

			$( "#amount-contribution" ).val( firstAmount.toLocaleString( "ru-RU" ) + " ₽"  ); //добавление знач. во второй инпут
		
			$( "#slider-range-contribution" ).slider('option',{min: firstAmount}); //минимальное значение второго слайдера равно 15% от первонач. взноса
			$( "#slider-range-contribution" ).slider('option',{max: totalPrice}); //максимальное значение второго слайдера равно значению первого слайдера
			$( "#slider-range-contribution" ).slider( "value", firstAmount );
			$( "#percents" ).html(((firstAmount ) / ( totalPrice) * 100).toFixed(1) + " %" ); //расчет процентов при движении первого ползунка
			monthlyPay();
		}
	});


	$( "#amount" ).val( $( "#slider-range" ).slider( "value" ).toLocaleString( "ru-RU" ) + " ₽"); //добавление в первый инпут значения при загрузке страницы


	//первоначальный взнос
	$("#slider-range-contribution").slider({
		range: "min",
		min: 45000,
		max: 30000000,
		value: 500000,
		slide: function( event, ui ) {

			$( "#amount-contribution" ).val( ui.value.toLocaleString( "ru-RU" ) + " ₽" ); //добавление знач. во второй инпут, добавление пробелов после 3х знаков

			$( "#percents" ).html((( ui.value ) / ( $( "#slider-range" ).slider( "value" )) * 100).toFixed(1) + " %" ); //расчет процентов при движении второго ползунка
			monthlyPay();
		}
	});


	$( "#amount-contribution" ).val( $( "#slider-range-contribution" ).slider( "value" ).toLocaleString( "ru-RU" ) + " ₽"); //добавление во второй инпут значения при загрузке страницы
	$( "#slider-range-contribution" ).slider('option',{max: 2000000}); //установка мин знач второго слайдера при загрузке стр
	$( "#slider-range-contribution" ).slider('option',{min: 300000}); //установка макс знач второго слайдера при загрузке стр
	$( "#percents" ).html( ($( "#slider-range-contribution" ).slider( "value" ) / ( $( "#slider-range" ).slider( "value" )) * 100).toFixed(1) + " %" ); //расчет процентов при загрузке стр


	//срок кредита
	$( "#slider-range-time" ).slider({
		range: "min",
		min: 1,
		max: 30,
		value: 15,
		slide: function( event, ui ) {
			//подстановка функции склонения лет и запись значения в инпут
			$( "#amount-time" ).val(ui.value + ' ' + years(ui.value));
			monthlyPay();
		}
	});


	$( "#amount-time" ).val( $( "#slider-range-time" ).slider( "value" ) + " лет");

	//сумма кредита
	$( ".calculation_value-sum" ).html(( $( "#slider-range" ).slider( "value" ) - $( "#slider-range-contribution" ).slider( "value" )).toLocaleString( "ru-RU" ) + " ₽"); 		

	let canvas = document.getElementById("chart");
	let context = canvas.getContext("2d");
		context.transform(1, 0, 0, -1, 0, canvas.height);	

	//ежемесячный платеж
	monthlyPay();
	
	
});