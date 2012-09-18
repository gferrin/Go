// Create a board object which keeps track of board information and 
// has methods which draw (and perhaps redraw) the board based on other 
// information stored in the object 
// requires the preexistance of a board tag on whichever page usesthis object

var Board = {};
// member variables
Board.board_length = 600;
Board.number_of_units = 19;
Board.unit_length = Math.round(Board.board_length / (Board.number_of_units + 1));
Board.piece_length = (Board.board_length / Board.number_of_units);
Board.game_length = (Board.unit_length * Board.number_of_units);
Board.margin = Math.round((Board.board_length - Board.game_length) / 2.0);
Board.piece_number_placed = 0;	// increment as each piece is placed
Board.current_color = 0; // 0 for black 1 for white, toggle between the two
// member functions 
Board.set_board_length = function(length) {
	Board.board_length = length;
	Board.unit_length = Math.round(Board.board_length / (Board.number_of_units + 1));
	Board.piece_length = (Board.board_length / Board.number_of_units);
	Board.game_length = (Board.unit_length * Board.number_of_units);
	Board.margin = Math.round((Board.board_length - Board.game_length) / 2.0);
};

Board.set_number_of_units = function(units) {
	if(units === 19 || units === 13 || units === 9 ) {
		Board.number_of_units = units;
		Board.unit_length = Math.round(Board.board_length / (Board.number_of_units + 1));
		Board.piece_length = (Board.board_length / Board.number_of_units);
		Board.game_length = (Board.unit_length * Board.number_of_units);
		Board.margin = (Board.board_length - Board.game_length) / 2.0;


	} 
};

Board.set_current_color = function(color) {
	if(color === 0  || color === 1 ){
		this.current_color = color; 
	} else {
		alert('color not supported');
	}
}; 

Board.draw_board = function() {
	// place a div tag for the board
	$('#board').html('<div id="boardContainer" > </div>');
	$('#boardContainer').css("width" , Board.board_length ).css("height" , Board.board_length);
	// place all the nessisary tags within the board container tag
	$('#boardContainer').html('<div id="boardGridContainer"></div><div id="boardStoneContainer"></div><div id="boardLastMoveSymbol"></div><div id="boardOverlay"></div>');
	// draw the grid 
	var grid_string = '<table class="boardGrid">';
	for (var i = 0; i < (this.number_of_units - 1); i++) {
        grid_string += '<tr>';
        for (var j = 0; j < (this.number_of_units - 1); j++) {
            grid_string += '<td></td>';
        }
        grid_string += '</tr>';
    }
    grid_string += '</table>';
    $("#boardGridContainer").html(grid_string);
    // add the dots that are on the board
    if(Board.number_of_units === 19 ){
    	for(var i = 0; i < 9; i++) {
    		var board_dot_string = '<div class="circle" id="dot' + i + '"></div>';
    		var board_dot_id = '#dot' + i;
    		$('#boardGridContainer').append(board_dot_string);
    		$(board_dot_id).addClass("boardDot");
    		if( i < 3){
    			$(board_dot_id).css("top" , (this.piece_length * 3.28 ));
    		} else if ( i < 6 ) {
    			$(board_dot_id).css("top" , (this.piece_length * 9.28 ));
    		} else {
    			$(board_dot_id).css("top" , (this.piece_length * 15.28 ));
    		}
    		if( i % 3 === 0) {
    			$(board_dot_id).css("left" , (this.piece_length * 3.28 ));
    		} else if ( i % 3 === 1 ) {
    			$(board_dot_id).css("left" , (this.piece_length * 9.28 ));
    		} else {
    			$(board_dot_id).css("left" , (this.piece_length * 15.28 ));
    		}
    	}
    } else if (Board.number_of_units === 13 ) {
    	for(var i = 0; i < 5; i++) {
    		var board_dot_string = '<div class="circle" id="dot' + i + '"></div>';
    		var board_dot_id = '#dot' + i;
    		$('#boardGridContainer').append(board_dot_string);
    		$(board_dot_id).addClass("boardDot");
    		if( i <  2 ){
    			$(board_dot_id).css("top" , (this.piece_length * 3.3 ));
    		} else if ( i < 3 ){
    			$(board_dot_id).css("top" , (this.piece_length * 6.3 ));
    		} else {
    			$(board_dot_id).css("top" , (this.piece_length * 9.3 ));
    		}
    		if ( i === 0 || i === 3) {
    			$(board_dot_id).css("left" , (this.piece_length * 3.3 ));
    		} else if ( i === 2) {
    			$(board_dot_id).css("left" , (this.piece_length * 6.3 ));
    		} else {
    			$(board_dot_id).css("left" , (this.piece_length * 9.3 ));
    		}
    		
    	}
    } else { // if number of units === 9 
    	for(var i = 0; i < 5; i++) {
    		var board_dot_string = '<div class="circle" id="dot' + i + '"></div>';
    		var board_dot_id = '#dot' + i;
    		$('#boardGridContainer').append(board_dot_string);
    		$(board_dot_id).addClass("boardDot");
    		if( i <  2 ){
    			$(board_dot_id).css("top" , (this.piece_length * 2.38 ));
    		} else if ( i < 3 ){
    			$(board_dot_id).css("top" , (this.piece_length * 4.38 ));
    		} else {
    			$(board_dot_id).css("top" , (this.piece_length * 6.38 ));
    		}
    		if ( i === 0 || i === 3) {
    			$(board_dot_id).css("left" , (this.piece_length * 2.38 ));
    		} else if ( i === 2) {
    			$(board_dot_id).css("left" , (this.piece_length * 4.38 ));
    		} else {
    			$(board_dot_id).css("left" , (this.piece_length * 6.38 ));
    		}		
    	}
    }

    $('.boardGrid').css("width" , this.game_length ).css( "height" , this.game_length ).css("margin", this.margin);
    $('.boardDot').css("width" , (this.unit_length / 4.0)).css("height" , (this.unit_length / 4.0));

};

Board.getElementPositionInPage = function (element) {
    var x = 0, y = 0;
    var n = element;
    // if element is null throw error: cannot get
    if (n === null) {
        throw { name: "CannotGet" };
    }
    for (var i = 0; i < 64; i++) {
        x += n.offsetLeft; // set x to the offset of the element in the page
        y += n.offsetTop;
        n = n.offsetParent;
        if (n === null) {
            return [x, y];
        }
    }
	// if n !== null then throw overflow
    throw { name: "Overflow" };
};

Board.getEventPosInBoardOverlay = function (e) {
	// set the var element-position to the previouse funciton being pased the id of boardOverlay
    var elementPos = this.getElementPositionInPage(document.getElementById("boardOverlay"));
    var mouseX = e.pageX - elementPos[0]; 
    var mouseY = e.pageY - elementPos[1];
    return [mouseX, mouseY]; // postion of mouse with respect to boardOverlay
};

Board.place_piece = function (move) {

		var piece_id = '#piece' + this.piece_number_placed;
		var piece_string = '<div class="circle" id="piece' + this.piece_number_placed + '"></div>'
		$('#boardStoneContainer').append(piece_string);
		
		var pieceLeft = (move.X * this.piece_length);
		var pieceTop = ( move.Y * this.piece_length);
		var pieceSize = ((this.unit_length * 95 ) / 100.0);
		$(piece_id).css("width" , this.piece_length).css("height" , this.piece_length).css("top" , pieceTop).css("left", pieceLeft).css({
			'display' : 'block',
			'position' : 'absolute'
		});
		if( this.current_color === 0 ){
			$(piece_id).css({
				'background-color' : 'black'
			});
			this.current_color = 1; 
		} else {
			$(piece_id).css({
				'background-color' : 'white'
			});
			this.current_color = 0; 
		}

		this.piece_number_placed++;
	
};

Board.remove_piece = function (id) {
	//alert('board.remove_piece being called');
	var id_to_remove = '#piece' + id;
	//alert(id_to_remove);
	$(id_to_remove).remove();

};

Board.Make = function(length,units,color){
	Board.set_board_length(length);
	Board.set_number_of_units(units);
	Board.set_current_color(color);
	Game = new Game(units, color);

	Board.draw_board();
}


$(document).ready( function (){
    //var io = require('socket.io');
    //var socket = io.connect();
	// for testing, to be removed in final version 
	Board.Make(600,19,0);
	//alert(Game.ko);
	//alert(Game.checkLegal(0,0));
	//alert('poop');
	//alert(Game.groupArray);

	$("#boardOverlay").mouseup(function (e) {
        e.preventDefault();
        var move = {};

		var currentMoveLocation = Board.getEventPosInBoardOverlay(e);
		move.Y = Math.floor(currentMoveLocation[1] / Board.piece_length);
		move.X = Math.floor(currentMoveLocation[0] / Board.piece_length);
		//alert('x and y ' + move.X + ',' + move.Y);
		if(Game.checkLegal(move.X,move.Y)){
			Board.place_piece(move);
			Game.place_piece(move.X,move.Y);
		} else if (!Game.checkLegal(move.X,move.Y)) {
			alert('move not legal');
		} else {
			alert('WTF');
		}
		
	    
    });
});


