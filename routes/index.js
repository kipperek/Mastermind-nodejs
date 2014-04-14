exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind',
        max: 0,
        size: 5,
        dim: 9
    });
};

exports.play = function (req, res) {
    var newGame = function () {
    var i, data = [],
        puzzle = req.session.puzzle;

    if(puzzle.size == 0)
        puzzle.size = 5;

    if(puzzle.dim == 0)
        puzzle.dim = 9;

    for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }

    req.session.puzzle.data = data;
    console.log("Wylosowane: " + data);
    //tworzymy w sesji objekt gry historii kropek do generowania wiadomości oraz ilości kroków
    req.session.game = { "whiteDot" : 0, "blackDot" : 0, "attempts" : 0};

    return {
        "retMsg": "Nowa gra została zainicjalizowana!",
        "retSize": puzzle.size
    };
};

    req.session.puzzle.size = 5;
    req.session.puzzle.dim = 9;
    req.session.puzzle.max = 0;
   
    //size
    if (req.params[2]) 
        req.session.puzzle.size = req.params[2];
    //dim
    if (req.params[4]) 
        req.session.puzzle.dim = req.params[4];
    //max
    if (req.params[6]) 
        req.session.puzzle.max = req.params[6];
    

    res.json(newGame());
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        //parametry pobieramy do tablicy move
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        console.log(move);
        /////////////////////////////////////
        req.session.game.attempts = req.session.game.attempts + 1;
        var rateString = "",
            win = false, fail = false, whiteDot = 0, blackDot = 0;
        
        //----Logika gierki----------------------------------------
        var dane = req.session.puzzle.data;
        var oc = new Array(), ocM = new Array();
        //--Dotki----
        //TODO!!!!!!!!!!!!!!!!
        for(var i = 0; i < move.length; i++){
            if(move[i] == dane[i]){
                blackDot++;
                oc[i] = true;
                ocM[i] = true;
            }
        }

        for(var i = 0; i < move.length; i++)
            for(var j = 0; j < dane.length; j++){
                if(move[i] == dane[j] && !oc[i] && !ocM[j]){
                    whiteDot++;
                    oc[i] = true;
                    ocM[j] = true;
                    break;
                }
            }
        //////////////////////////////////
       
        //--Mesedż----
        var bad = "Kiepsko!",
            noChange = "Próbuj dalej!",
            good = "Coraz lepiej!",
            vGood = "Brawo oby tak dalej!",
            congrats = "Gratulacje wygrałeś!",
            loose = "Niestety przekroczyłeś maksymalną liczbę prób, spróbuj jeszcze raz!";
         
        if(blackDot == req.session.puzzle.size){
            rateString = congrats;
            win = true;
        }
        else if(req.session.game.attempts >= req.session.puzzle.max && req.session.puzzle.max != 0){
            rateString = loose;
            fail = true;
        }
        else if(blackDot == req.session.game.blackDot && whiteDot == req.session.game.whiteDot)
            rateString = noChange;

        else if(blackDot > req.session.game.blackDot)
            rateString = vGood;

         else if(whiteDot > req.session.game.whiteDot)
            rateString = good;
        else
            rateString = bad;        

        req.session.game.blackDot = blackDot;
        req.session.game.whiteDot = whiteDot;
        
        return {
            "retVal": { "dots": { "whiteDot": whiteDot, "blackDot": blackDot }, "win": win, "attempts" : req.session.game.attempts, 'fail' : fail},
            "retMsg": rateString
        };
    };

 res.json(markAnswer());
};


