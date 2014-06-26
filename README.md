This is the game of [Go](https://en.wikipedia.org/wiki/Go_\(board_game\)) 囲碁 impleneted in javascript

To run open `game.html` in browser 

![go board](https://raw.github.com/gferrin/Go/master/img/board.png)

The file that contains all the board logic is `legal.js`. The interesting thing
about it is that it doesn't use a recursive algorithm to score but instead uses 
a group data structure to keep track of how many liberties are in each group on 
the board. The program then joins two groups when a connecting piece is 
placed. This makes it so that the program never has to do more than eight checks
per move to determine if a group should be taken, no matter the size of the group. 
The program still can’t join all groups due to some weird fringe cases that are 
difficult to check for. 
