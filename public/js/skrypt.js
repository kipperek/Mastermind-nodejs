$(function () {
	//TODO LIST
	//1. usunac listnery gdy sie zmienia plansza

	//--------HELPERS--------------------------------------------------------------------------------
	var gameSize = 0;
	
	//Idiot proof
	var blockText = function(e) {
		e.target.value = e.target.value.replace(/\D/g,"");
	}
	$('input[type=text]').change(blockText);

	//--------ROZGRYWKA------------------------------------------------------------------------------
	var playGame = function (history,msg,gameObj){
		$('#msgH3').html(msg);
		
		//wygrana?
		if(!gameObj.win && !gameObj.fail){ //jeszcze nie wygrana ani przegrana to...
			//wyczysc inputy
			$('.gameInput').val("");
			
			//Ustaw lampki
			var lampki = "";
			//czarne lampki
			for(var i=0; i < gameObj.dots.blackDot; i++)
				lampki += "<div class='fullDot'></div>";
			//biale lampki
			for(var i=0; i < gameObj.dots.whiteDot; i++)
				lampki += "<div class='emptyDot'></div>";

			//dodaj historię
			var tr= "<tr>";
			for(var i=0; i<history.length; i++)
				tr+= "<td>" +history[i]+ "</td>";

			tr+="<td>"+lampki+"</td>";
			tr += "</tr>";
			$('#gameTableBody').html(tr+$('#gameTableBody').html());

			//ustaw liczbe prób
			$('#attempts').html(gameObj.attempts);

		} else {
			$('#gameWrap').html("");
		}


	}

	var zgadujClick = function(e) {
		var link = "/mark/";
		var canSend = true;
		var attempt = [];
		//zbieramy dane z imputów
		$('.gameInput').each(function(i, el){
			if(el.value.length > 0){
				link += el.value + "/";
				attempt.push(el.value);
			}
			else
				canSend = false;
		});

		//jezeli wszystkie inputy wypełnione i canSend=true to wysylamy ajaxowo zapytanie i dodajemy do 'historii', jeżeli nie to informujemy
		//o braku mozliwosci wysylki paczki przez poczte polska
		if(canSend)
			$.ajax({
	            url: link,
	            method: 'get',
	            success: function(data){
	                playGame(attempt, data.retMsg,data.retVal);
	            },
	            fail: function(data){
	                $('#place').html("Wystąpil błąd przy zgadywaniu!");
	            }
		    });
		else
			$('#msgH3').html("Wszystkie pola muszą być wypełnione, aby zgadywać!");

	}

	//--------TWORZENIE NOWEJ GRY--------------------------------------------------------------------

	//tworzymy miejsce dla nowej gry i ustanawiamy wszystkie listenery
	var createPlace = function(msg,size){
		//tworzymy tyle inputów ile liczb do zgadnięcia
		gameSize = size;
		var inputs = "";
		var head = "";
		for(var i=1;i<=size;i++){
			head += "<th>" + i + ".</th>";
			inputs += "<td><input type='text' class='gameInput' name='"+i+"' /></td>";
		}

		//zmieniamy kod głównego diva gry
		var source = "<button id='restart'>Zacznij od nowa</button> Próby: <span id='attempts'>0</span> <div id='msg'><h3 id='msgH3'>"+msg+"</h3></div>"+
					 "<div id='gameWrap'><div id='gameDiv'><button id='zgaduj'>Zgaduj liczby!</button><br/><table id='gameTable'><thead><tr>"+head+"</tr><tr>"+inputs+"</tr></thead><tbody id='gameTableBody'></tbody></table></div></div>";
		$('#place').html(source);

		//dodajemy blokowanie literek do nowych inputów
		$('input[type=text]').change(blockText);
		//restarcik ;)
		$("#restart").click(function(e){
			if(confirm('Na pewno zacząć od nowa?'))
			window.location.reload();
		});

		//zgaduj!
		$("#zgaduj").click(zgadujClick);
			
	}

	//naciskamy Start Gry
	$('#start').click(function(e){
		//pobieramy i ustawiamy wartości z pól inicjalizujacych
	    var size="0";
	    var dim="0";
	    var max="0";
	    var sizeVal = $('#size').val();
	    var dimVal = $('#dim').val();
		var maxVal = $('#max').val();

	    if(sizeVal.length > 0)
	            size = sizeVal;
	    if(dimVal.length > 0)
	            dim = dimVal;
	     if(maxVal.length > 0)
	            max = maxVal;
	    //ustawiamy link do wysłania
	    var link = "/play/size/"+size+"/dim/"+dim+"/max/"+max+"/";

	    //wysyłamy request i jest wszystko ok tworzymy plansze gry!
	    $.ajax({
            url: link,
            method: 'get',
            success: function(data){
                    	createPlace(data.retMsg,data.retSize);
            },
            fail: function(data){
                    $('#place').html("Wystąpil błąd przy tworzeniu nowej gry!");
        	}
	    });
	});
});
