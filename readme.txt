Link to demo on GitHub:
https://michaelmcgilvray.github.io/COMP-4610-HW5/

Link to repository on GitHub:
https://github.com/MichaelMcGilvray/COMP-4610-HW5



The write-up (also in the write-up.txt):

At the time of submission, all features described in the "How You Will Be Graded"
section of the homework specification has been completed and should be fully
functional. This excludes both extra credit options. I will go through each
bullet point to briefly explain how it works:

1. Tiles are randomly selected from a data structure (with proper distribution)
    The distribution of tiles is obtained from the data.js file and loaded 
    into an array of tile objects. Each object contains the letter and value of
    that tile and to ensure the proper distribution, are created the number of
    times specified by the amount field from the data.js file. This is all done
    in the restartGame() function.

2. Tiles can be dragged and dropped onto the board
    This is done by making all tiles draggables and slots on the board 
    droppables using jQuery. Tiles snap into position in both the board and 
    tile rack.

3. Identify which tile is dropped in which slot in the board
    This is done by updating my board array of tile objects on the drop and out
    events of my droppables. On a drop event, the tile is added to the array, 
    and on an out event, the tile is removed from the array.

4. Board includes bonus tiles
    I just made two slots use a doubleWord class that changes their appearance
    and I take this into account later when calculating the score.

5. Score is tallied
    Using my board array of tile objects, I just add up the value of each letter
    and adjust accordingly if there is a bonus tile being used.

6. Words can be played until restart or all tiles are depleted
    The "start over" button essentially runs the initialize function again and
    when the user has run out of tiles, a message is displayed to let them know
    the game is over.

7/8.  The board is cleared and new tiles are generated after a word is confirmed
    Pressing the "next word" button will clear the board, add the word score to
    total score, and generate more tiles to fill the tile rack to 7. During this
    process, the remaining tiles counter is adjusted.

9. Score is kept for multiple words
    Like I said previously, the restart button will reset the game to its
    initial state, except for the highest score. Pressing the next word button
    will allow the user to play another word because the board will be cleared
    and new tiles will be generated.

10. Tiles can be dragged from rack to board and bounce back to rack on error
    Using jQuery-simulate, I simulate a drag event on the tile that is placed 
    out of bounds to drag it back to the rack. Rather than just using the 
    "revert: "invalid"" code, this method allows me to send the tile back in 
    some other corner cases.

11. Tiles on the board can be moved back to the rack
    To implement the functionality so tiles must be placed directly next to 
    another tile, I lock tiles into position that are in the middle of a word.
    This means that if you want to move tile from the board to the rack, it must
    be a tile on the end of the word. To make this easier for the user to
    understand, the movable tiles at the end of a word are glow in red when
    hovered over.

12. Tiles must be placed directly next to another tile
    To implement this, I added a blue glow to the slots that are available for 
    a tile. Once a tile is placed only the slots next to it allow a draggable
    to be dropped inside it and glow blue.

13. Game can be restarted
    Like I said previously, at any point the "start over" button can be pressed
    and the game will be reverted to its original state except for the highest
    score. Meaning all tiles are regenerated from the data.js file, and the other
    counters are reset.
