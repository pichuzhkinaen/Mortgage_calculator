$(document).ready(function() {
	//склонение слова "год"
	function years(n) {  
		var arr = ['год', 'года', 'лет'];
		n = Math.abs(n) % 100; 
		var n1 = n % 10;
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
			//console.log(ui.value);
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

		}
	});
	$( "#amount-time" ).val( $( "#slider-range-time" ).slider( "value" ) + " лет");
});