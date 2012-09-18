function Piece(x,y,color){
	this.xPosition = x; // keeps track of x position in Game.board array
	this.yPosition = y; // keeps track of y position in Game.board array
	this.groupID = 0; 
	this.piece_color = color;
	this.move_number = 0; // This keeps track of what turn each piece was placed for (for ko check mostly)

	this.set_groupID = function(id){
		this.groupID = id;
	};

	this.set_move_number = function(moveNum) {
		this.move_number = moveNum;
	};

	this.reset_piece_with_piece = function(piece){
		this.xPosition = piece.xPosition;
		this.yPosition = piece.yPosition;
		this.piece_color = piece.piece_color;
		this.groupID = piece.groupID;
		this.move_number = piece.move_number;
	};

	this.reset_piece = function(x,y,color,ID,move) {
		this.xPosition = x;
		this.yPosition = y;
		this.piece_color = color;
		this.groupID = ID;
		this.move_number = move;
	};
};

function Piece_Empty(color){
	this.piece_color = color;
	this.groupID = -1;
	this.influences = [];

	this.add_influence = function(id){
		if(this.influences.length < 4 ){
			// conside running for loop which would check to make sure that an ID is not added reduendently
			// may want to take this check out once program is working (becuase this should never actually occure 
			// if the program is designed properlly)
			for(var i = 0; i < this.influences.length; i++){
				if(this.influences[i] === id){
					return false;
				}
			}
			this.influences.push(id);
		} else {
			alert('to many influences');
		}
	};

	this.query_influences = function(id){
		//alert('in query ');
		for(var i = 0;i < this.influences.length; i++){
			if( this.influences[i] === id ){
				//alert('found Id ' + this.influences[i] + ' = ' + id  );
				return true;
			} 
		}
		//alert('influences legnth ' + this.influences.length);
		// if after checking everything it does not return true, then return false
		return false;
	};

};

function Group(liberties, ID){
	this.liberties = liberties;
	this.ID = ID;
	this.number_of_pieces = 1;
	this.members = [];

}

function Game(size, color) {


	// set the dinemsion of the board
	if(size === 9 || size === 13 || size === 19 )
	{
		this.boardSize = size;
	} else {
		this.boardSize = 19;
	}

	this.empty = 0;
	this.black = 1;
	this.white = 2;
	this.edge = new Piece(-1,-1,-1); // Some unrealistic piece to designate the edge of the board
	if( color === 0 ) { this.turn = 1} else { this.turn = 2 }; // this keeps track of who's turn it is switching between 1 and 2
	this.moveNum = 0; // this only increments when a stone is placed
	this.absoluteMoveNum = 0; // this increments even when a player passes
	this.ko = false; // set to true when a group of size = 1 gets taken
	this.ko_set_move = 0; // this is the move number of when ko was set so I can tell when to set it back
	this.numGroups = 0; // Mainly used to assign groups an index value
	this.groupArray = [];
	this.opponent = false;
	// then make the needed stuff
	
	this.board = []; // make a new array of the desired size
	
	for(var i=0;i<this.boardSize;i++){ // for loop which executes board size many times
		this.board[i] = []; //each time setting each element to an array of size boardSize
		for (var j=0;j<this.boardSize;j++){
			this.board[i][j] = new Piece_Empty(0); // This initializes everything to empty 
		}
	}

	this.getLeft = function(x,y){
		if(x > 0){ var left = this.board[x-1][y];} else{ var left = this.edge;} 
		return left;
	};
	this.getRight = function(x,y){
		// this -1 has to be here and not on bottom because x is from left to right but y is from top to bottom
		if(x < this.boardSize - 1 ){ var right = this.board[x+1][y];} else{ var right = new Piece(-1,-1,-1);}
		return right;
	};
	this.getTop = function(x,y){
		if(y > 0){ var top = this.board[x][y-1];} else{ var top = this.edge;}
		return top;
	};
	this.getBottom = function(x,y){
		if(y < this.boardSize - 1){ var bottom = this.board[x][y+1];} else{ var bottom = this.edge;}
		return bottom;
	};

	this.checkLegal = function (x,y){
		//Check that the position in question is empty and if not return false
		if(this.board[x][y].piece_color !== this.empty){ return false; }
		// check the 4 adjacent squares and store them in temporary variables
		var left = this.getLeft(x,y);
		var right = this.getRight(x,y);
		var top = this.getTop(x,y);
		var bottom = this.getBottom(x,y);
		// If Game.ko is true then check to see if any of the adjacent pieces were placed last turn and if
		// that same piece's group only has one liberty then return false (note that this check must come first)
		// also make sure that the opposite color group in question only has one member
		if(this.ko === true){
			alert('ko is set to true, running checks');
			if(left.move_number === this.moveNum-1 && this.groupArray[left.groupID].liberties === 1 && this.groupArray[left.groupID].number_of_pieces === 1) {return false;}
			if(right.move_number === this.moveNum-1 && this.groupArray[right.groupID].liberties === 1 && this.groupArray[right.groupID].number_of_pieces === 1) {return false;}
			if(top.move_number === this.moveNum-1 && this.groupArray[top.groupID].liberties === 1 && this.groupArray[top.groupID].number_of_pieces === 1) {return false;}
			if(bottom.move_number === this.moveNum-1 && this.groupArray[bottom.groupID].liberties === 1 && this.groupArray[bottom.groupID].number_of_pieces === 1) {return false;}
		}
		
		// Checks to see if any adjacent intersections are empty if so then move is legal
		if(left.piece_color === 0 || right.piece_color === 0 || top.piece_color === 0 || bottom.piece_color === 0){return true;}
		// If there is a group of the same color and it has more then 1 liberty available then move is legal
		if(left.piece_color === this.turn && this.groupArray[left.groupID].liberties > 1) {return true;}
		if(right.piece_color === this.turn && this.groupArray[right.groupID].liberties > 1) {return true;}
		if(top.piece_color === this.turn && this.groupArray[top.groupID].liberties > 1) {return true;}
		if(bottom.piece_color === this.turn && this.groupArray[bottom.groupID].liberties > 1) {return true;}
	    
		// If there is a group of the opposite color and it has 1 liberty then move is legal
		if(left.piece_color !== this.turn && this.groupArray[left.groupID].liberties === 1) {return true;}
		if(right.piece_color !== this.turn && this.groupArray[right.groupID].liberties === 1) {return true;}
		if(top.piece_color !== this.turn && this.groupArray[top.groupID].liberties === 1) {return true;}
		if(bottom.piece_color !== this.turn && this.groupArray[bottom.groupID].liberties === 1) {return true;}
		// If none of those things are true then it must be false
		else {return false;}
	
	}; // end of Game.checkLegal

	// This function takes two groups and joins the one with fewer elements to the one with more
	// It assumes that the correct number of liberties are already assigned to each group
	this.joinGroups = function (group1,group2){ 
		alert('joining groups');
		if(group1.piece_color === group2.piece_color){
			// if group one has more pieces then group two
			if(group1.number_of_pieces >= group2.number_of_pieces){
				//liberty variable to change so that I give the exact amount of liberties to the new groups
				var liberties = group2.liberties - 1;
				// join the member arrays 
				for(var i=0;i<group2.number_of_pieces;i++){
					// get the x, y coordinates for the piece in question 
					var x = group2.members[i].xPosition;
					var y = group2.members[i].yPosition;
					// then find the ajacent squares (I'm worried about a noticable lag from this operation)
					var left = this.getLeft(x,y);
					var right = this.getRight(x,y);
					var top = this.getTop(x,y);
					var bottom = this.getBottom(x,y);
					// now using these update the liberty count apropriatlly 
					if(left.piece_color === this.empty ){
						for(j = 0; j < left.influences.length; j++){
							if(left.influences[j] === group1.groupID){
								liberties--; // reduce the libery count 
							}
							if(left.influences[j] === group2.groupID){
								left.liberties.remove(j);
							}
						}
					} 
					if(right.piece_color === this.empty ){
						for(j = 0; j < right.influences.length; j++){
							if(right.influences[j] === group1.groupID){
								liberties--;
							}
							if(right.influences[j] === group2.groupID){
								right.liberties.remove(j);
							}
						}
					}
					if(top.piece_color === this.empty ){
						for(j = 0; j < top.influences.length; j++){
							if(top.influences[j] === group1.groupID){
								liberties--;
							}
							if(top.influences[j] === group2.groupID){
								top.liberties.remove(j);
							}
						}
					}
					if(bottom.piece_color === this.empty ){
						for(j = 0; j < bottom.influences.length; j++){
							if(bottom.influences[j] === group1.groupID){
								liberties--;
							}
							if(bottom.influences[j] === group2.groupID){
								bottom.liberties.remove(j);
							}
						}
					} 
					// change the id of the piece objects in the board array 
					this.board[x][y].groupID = group1.ID;
					// this sets the groupID of each piece = to the ID of the other group
					group2.members[i].groupID = group1.ID;
					// Then append each element onto the groupArray of the game object
					this.groupArray[group1.ID].members.push(group2.members[i]);
					//alert(this.groupArray[group1.ID].liberties);
				}
				group1.liberties += liberties; 
				group1.number_of_pieces += group2.number_of_pieces;
				this.groupArray[group2.ID] = null; // This gets rid of the group object I think, assuming it is only
			                                   // stored in the group array 
			    //alert('contents of old group ' + this.groupArray[group2.ID]);                               
				// otherwise if group2 is bigger then group1
			} else { // do everything the same but with the groups switched around

				var liberties = group1.liberties - 1;
				for(var i=0;i<group1.number_of_pieces;i++){
					// get the x, y coordinates for the piece in question 
					var x = group1.members[i].xPosition;
					var y = group1.members[i].yPosition;
					// then find the ajacent squares (I'm worried about a noticable lag from this operation)
					var left = this.getLeft(x,y);
					var right = this.getRight(x,y);
					var top = this.getTop(x,y);
					var bottom = this.getBottom(x,y);
					// now using these update the liberty count apropriatlly 
					if(left.piece_color === this.empty ){
						for(j = 0; j < left.influences.length; j++){
							if(left.influences[j] === group2.groupID){
								liberties--; // reduce the libery count 
							}
							if(left.influences[j] === group1.groupID){
								left.liberties.remove(j);
							}
						}
					} 
					if(right.piece_color === this.empty ){
						for(j = 0; j < right.influences.length; j++){
							if(right.influences[j] === group2.groupID){
								liberties--;
							}
							if(right.influences[j] === group1.groupID){
								right.liberties.remove(j);
							}
						}
					}
					if(top.piece_color === this.empty ){
						for(j = 0; j < top.influences.length; j++){
							if(top.influences[j] === group2.groupID){
								liberties--;
							}
							if(top.influences[j] === group1.groupID){
								top.liberties.remove(j);
							}
						}
					}
					if(bottom.piece_color === this.empty ){
						for(j = 0; j < bottom.influences.length; j++){
							if(bottom.influences[j] === group2.groupID){
								liberties--;
							}
							if(bottom.influences[j] === group1.groupID){
								bottom.liberties.remove(j);
							}
						}
					} 
					// change the id of the piece objects in the board array 
					this.board[x][y].groupID = group2.ID;
					group1.members[i].groupID = group2.ID;
					// make sure the main groeup array in the Game object is updates aswell
					this.groupArray[group2.ID].members.push(group1.members[i]);
					//alert(this.groupArray[group2.ID].liberties);
				}
				group2.liberties += liberties;
				group2.number_of_pieces += group1.number_of_pieces;
				this.groupArray[group1.ID] = null; // LOOK AT THIS CARFULLY this may be what is causing groups to get fucked 
				// up after a group is taken because if it no longer holds the place for groups that are taken then the 
				// pieces will no longer be indexed properly
				//alert('contents of old group ' + this.groupArray[group1.ID]);
			}
		} else {
			alert('Error: attempting to join groups of different color');
		}
		alert('end of joinGroup');
	}; // end of Game.joinGroup function
	this.opponent_place_piece = function(x,y){
		if(this.opponent){
			this.place_piece(x,y);
		}
	}
	// This makes all the necessary changes when a piece is placed
	this.place_piece = function (x,y){
		
	
		// make a new piece variable for the current position
		var currentPiece = new Piece(x,y,this.turn); 
		//alert(currentPiece.piece_color);
		currentPiece.move_number = this.moveNum; // give it a move number value of current move number
		//alert(currentPiece.piece_color + ',' + currentPiece.move_number);
		//alert(currentPiece.move_number);
		
		// Number of liberties new piece has
		var moveLiberties = 0;
		// check the 4 adjacent squares and store them in temporary variables
		var left = this.getLeft(x,y); 
		var right = this.getRight(x,y);	
		var top = this.getTop(x,y); 
		var bottom = this.getBottom(x,y);	
		// booleans to keep track of adjacent groups of same color which need to be joined
		var isGroup = false;
		// find total liberties that this move has by giving empty intersections a value of +1
		if(left.piece_color === this.empty){ moveLiberties++; } 
		if(right.piece_color === this.empty){ moveLiberties++; }
		if(top.piece_color === this.empty){ moveLiberties++; }
		if(bottom.piece_color === this.empty){ moveLiberties++; }
		// if any of the adjacent intersections have a group of the same color then reduce the liberty count 
		// by -1, this makes sense because if there are more then one, then the groups will be joined and the loss
		// of a liberty will have been accounted for, and if there is only one then they lost the same liberty 
		if(left.piece_color === this.turn || right.piece_color === this.turn || top.piece_color === this.turn || bottom.piece_color === this.turn){
			moveLiberties--;
		}
		//alert('total liberties for move ' + moveLiberties);
	
		// else if statements are used because once it is attached to one group you do not want
		// to try and re-attach it to another, instead once isGroup is true then you want to check
		// to make sure that any of the other groups do not actually have the same ID and if that is 
		// the case then join the two groups
		// If the first check is a group of the same color
		if(left.piece_color === this.turn ){
			isGroup = true; // set the flag that one group has been found
			currentPiece.set_groupID(left.groupID); // give it a new ID = to whatever group is being joined
			this.groupArray[left.groupID].members.push(currentPiece); // add the move to the piece array of the group
			// add a condition before incrementing libierties whcih makes sure that id does not share a liberty
			// with this piece
			if(right.piece_color === this.empty){
				// dont check these things in the same if statment because query runs a for loop (computationally more expensive)
				if(right.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(top.piece_color === this.empty){
				if(top.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(bottom.piece_color === this.empty){
				if(bottom.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}


			this.groupArray[left.groupID].liberties += moveLiberties; // update its liberty count
			//alert(this.groupArray[left.groupID].liberties);
			this.groupArray[left.groupID].number_of_pieces++;
			//alert('made it to the end of left');
		} else if (right.piece_color === this.turn ){ // else if 
			isGroup = true; // set the flag that one group has been found
			currentPiece.set_groupID(right.groupID);// give it a new ID = to whatever group is being joined
			this.groupArray[right.groupID].members.push(currentPiece); // add the move to the piece array of the group
			if(left.piece_color === this.empty){
				// dont check these things in the same if statment because query runs a for loop (computationally more expensive)
				if(left.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(top.piece_color === this.empty){
				if(top.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(bottom.piece_color === this.empty){
				if(bottom.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			this.groupArray[right.groupID].liberties += moveLiberties; // update its liberty count
			//alert(this.groupArray[right.groupID].liberties);
			this.groupArray[right.groupID].number_of_pieces++;
		} else if (top.piece_color === this.turn){
			isGroup = true; // set the flag that one group has been found
			currentPiece.set_groupID(top.groupID); // give it a new ID = to whatever group is being joined
			this.groupArray[top.groupID].members.push(currentPiece); // add the move to the piece array of the group
			if(right.piece_color === this.empty){
				// dont check these things in the same if statment because query runs a for loop (computationally more expensive)
				if(right.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(left.piece_color === this.empty){
				if(left.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(bottom.piece_color === this.empty){
				if(bottom.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			this.groupArray[top.groupID].liberties += moveLiberties; // update its liberty count
			//alert(this.groupArray[top.groupID].liberties);
			this.groupArray[top.groupID].number_of_pieces++;
		} else if (bottom.piece_color === this.turn){
			isGroup = true; // set the flag that one group has been found
			currentPiece.set_groupID(bottom.groupID); // give it a new ID = to whatever group is being joined
			this.groupArray[bottom.groupID].members.push(currentPiece); // add the move to the piece array of the group
			if(right.piece_color === this.empty){
				// dont check these things in the same if statment because query runs a for loop (computationally more expensive)
				if(right.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(top.piece_color === this.empty){
				if(top.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			if(left.piece_color === this.empty){
				if(left.query_influences(currentPiece.groupID)){
					moveLiberties--;
				}
			}
			this.groupArray[bottom.groupID].liberties += moveLiberties; // update its liberty count
			//alert(this.groupArray[bottom.groupID].liberties);
			this.groupArray[bottom.groupID].number_of_pieces++;
		}
		//alert('isGroup ' + isGroup );

		
		//alert('made it past these things');
		
		// If isGroup is set to true and any of the remaining pieces are of the same color and 
		// the group ID of the piece being placed is different then the groups in question, join the two groups
		// left does not have to be checked because if it should be attached then it will have been done
		// must have add influence insidee the if stament because in one instance it has to b done before any 
		// atempts are made to join groups, otherwise it must be done after a piece is assigned a groupID
		// first and checking for it here would be redundant
		if(isGroup === true){ // If one group has already been found
			// after the group Id of the currentPiece has been changed or if it has not then 
			// set the inluenced to all of the adjacent intersection of empty_pieces
			if(left.piece_color === this.empty ){ left.add_influence(currentPiece.groupID); }
			if(right.piece_color === this.empty ){ right.add_influence(currentPiece.groupID); }
			if(top.piece_color === this.empty ){ top.add_influence(currentPiece.groupID); }
			if(bottom.piece_color === this.empty ){ bottom.add_influence(currentPiece.groupID); }
			//alert('inside is group check');
			// and if the pieces color matches  and the ID's do not
			if(right.piece_color === this.turn && right.groupID !== currentPiece.groupID ){
				// then join the two groups
				this.joinGroups(this.groupArray[right.groupID],this.groupArray[currentPiece.groupID]);
			}
			if(top.piece_color === this.turn && top.groupID !== currentPiece.groupID ){
				this.joinGroups(this.groupArray[top.groupID],this.groupArray[currentPiece.groupID]);
			}
			if(bottom.piece_color === this.turn && bottom.groupID !== currentPiece.groupID ){
				this.joinGroups(this.groupArray[bottom.groupID],this.groupArray[currentPiece.groupID]);
			}
			//alert('made it out of isgroup true');
		} else { // otherwise the piece does not belong to any group and needs to make a new one
			currentPiece.set_groupID(this.numGroups); // set the group ID to the groups index
			// now make a new group and give it proper values 
			var group = new Group(moveLiberties, currentPiece.groupID);
			group.members.push(currentPiece);
			// now add group to game group array
			this.groupArray.push(group);	
			this.numGroups++; // increment the number of groups index
			// after the group Id of the currentPiece has been changed or if it has not then 
			// set the inluenced to all of the adjacent intersection of empty_pieces
			if(left.piece_color === this.empty ){ left.add_influence(currentPiece.groupID); }
			if(right.piece_color === this.empty ){ right.add_influence(currentPiece.groupID); }
			if(top.piece_color === this.empty ){ top.add_influence(currentPiece.groupID); }
			if(bottom.piece_color === this.empty ){ bottom.add_influence(currentPiece.groupID); }
		}
		
		// Store the piece in the game.board (this needs to be done last)
		this.board[x][y] = new Piece(currentPiece.xPosition,currentPiece.yPosition,currentPiece.piece_color);
		this.board[x][y].set_groupID(currentPiece.groupID);
		this.board[x][y].set_move_number(currentPiece.move_number);
		
		// Now I need to make all necessary changes to groups of the opposite color, namely updating 
		// their liberty count and activating the takeGroup function if they have no liberties left
		// This may be moved to the beginning of function to make it seem like the program is running faster.
		// This makes sense because you can never take away more then one liberty for a given group by placing a piece
		// also this cascading pattern works because can't take away a liberty from the same group more then once
		// and it adds a check in the order of which each occurs
		
		// this is to make ko set properly 
		
		if(left.piece_color !== this.turn && left.piece_color !== this.empty && left.piece_color !== this.edge.piece_color ){
			this.groupArray[left.groupID].liberties--;
			if(this.groupArray[left.groupID].liberties === 0){ this.takeGroup(left.groupID);}
		}
		if(right.piece_color !== this.turn && right.piece_color !== this.empty && right.piece_color !== this.edge.piece_color ){
			if(right.groupID !== left.groupID){
				this.groupArray[right.groupID].liberties--;
				if(this.groupArray[right.groupID].liberties === 0){ this.takeGroup(right.groupID);}
			}
		}
		if(top.piece_color !== this.turn && top.piece_color !== this.empty  && top.piece_color !== this.edge.piece_color  ){
			if(top.groupID !== left.groupID && top.groupID !== right.groupID ){
				this.groupArray[top.groupID].liberties--;
				if(this.groupArray[top.groupID].liberties === 0){ this.takeGroup(top.groupID);}
			}
		}
		if(bottom.piece_color !== this.turn && bottom.piece_color !== this.empty && bottom.piece_color !== this.edge.piece_color ){
			if(bottom.groupID !== left.groupID && bottom.groupID !== right.groupID && bottom.groupID !== top.groupID){
				this.groupArray[bottom.groupID].liberties--;
				if(this.groupArray[bottom.groupID].liberties === 0){ 
					this.takeGroup(bottom.groupID);
				}
			}	
		}
		// set to to false when it needs to
		//if((!koSet) && (this.ko === true)){ this.ko = false; }
	
		// Other changes that need to be made to game object when a piece is placed
		if(this.turn === 1){this.turn = 2;} else {this.turn = 1;} // toggle turn 
		if(((this.moveNum - this.ko_set_move) > 0) && this.ko === true ) { this.ko = false; } // set ko back to false if a turn has elapsed
		this.moveNum++; // increment the move count
		this.absoluteMoveNum++; // as well as absolute move count

		//alert('end of placePiece ' + this.turn);
	
	}; // end of Game.placePiece function 

	this.takeGroup = function(ID){
		//alert('inside takeGroup function');
		// there needs to be something which makes sure that each piece does not give the same 
		// liberty back to a group more then once
		// for every piece in given group
		for(var i=0;i<this.groupArray[ID].number_of_pieces;i++){
			// get the location of the piece in question 
			var x = this.groupArray[ID].members[i].xPosition;
			var y = this.groupArray[ID].members[i].yPosition;
			//alert(x + ',' + y);
			// remove the actually div tag using Board object from board.js
			Board.remove_piece(this.board[x][y].move_number);
			
			// check the 4 adjacent squares and store them in temporary variables
			var left = Game.getLeft(x,y);
			var right = Game.getRight(x,y);
			var top = Game.getTop(x,y);
			var bottom = Game.getBottom(x,y);

			// set piece location in game board = to nothing
			this.board[x][y] =  new Piece_Empty(0);
			// now update groups liberties appropriately, keeping track of which groups are affected
			// never hitting the same one more then once, makeing sure that its not empty
			// also make sure the new piece has the correct influences (no removing needs to take place because it was just created)
			// because of the cascading pattern it will not redundentlly add group ID's to influenced list
			if(left.piece_color === this.turn  ){
				this.groupArray[left.groupID].liberties++;
				this.board[x][y].influences.push(left.groupID);
			}
			if(right.piece_color === this.turn ){
				if(right.groupID !== left.groupID){
					this.groupArray[right.groupID].liberties++;
					this.board[x][y].influences.push(right.groupID);
				}
			}
			if(top.piece_color === this.turn ){
				if(top.groupID !== left.groupID && top.groupID !== right.groupID){
					this.groupArray[top.groupID].liberties++;
					this.board[x][y].influences.push(top.groupID);
				}
			}
			if(bottom.piece_color === this.turn ){
				if(bottom.groupID !== left.groupID && bottom.groupID !== right.groupID && bottom.groupID !== top.groupID){
					this.groupArray[bottom.groupID].liberties++;
					this.board[x][y].influences.push(bottom.groupID);
				}
			}
		} // end of for loop 
		// now make all necessary changes to Game object including ko
		// don't make any changes to numGroups, this is because this is used more to index groups in the group
		// array as opposed to actually indicating how many groups are in the game object 
		if(this.groupArray[ID].number_of_pieces === 1){ 
			this.ko = true;
			this.ko_set_move = this.moveNum;
			this.groupArray[ID] = null;
			//return true;
		} else {
			this.ko = false;
			this.groupArray[ID] = null;
			//return false;
		}
		
		//alert('end of takeGroup'); 	
	}; // end of takeGroup function 

}; // end of Game constructor 











