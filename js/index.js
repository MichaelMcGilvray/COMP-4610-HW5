/*
File: index.js
GUI Assignment: Homework 5 - Scrabble
Michael McGilvray, michael_mcgilvray@student.uml.edu
Copyright (c) 2021 by Michael McGilvray. All rights reserved. May be freely 
copied or excerpted for educational purposes with credit to the author.
Updated by MM on December 13th, 2021 at 3:00PM

This file serves as the behavior layer of the game Scrabble. It adds nearly all
of the functionality with the help of jQuery, and allows the user to play a
basic game of Scrabble. It adds tile generation using a JSON source file and
the ability for each tile to be dragged. Tiles can be dragged to any available
slot on the board or back to the rack where they originate. Cases when the user 
drops tiles outside of these locations are handled and also forces the user
play Scrabble by the traditional rules. At any point, the game can be restarted
by pressing the "start over" button and if the game is completed by playing
all tiles, a message is displayed.
*/

$(document).ready(function () {
    // Available total tiles
    var tiles = [];  
    // Which tile is in which slot of board
    var board = [{}, {}, {}, {}, {}, {}, {}];
    // Current score
    var score = 0;
    // Current word
    var word = "";
    // Highest score
    var highestScore = 0;


    restartGame();


    // ========== Setup game initially ==========
    function restartGame() {
        tiles = [];

        // Load tiles
        console.log(data);
        for (var i = 0; i < data.pieces.length; i++) {
            // Push the tile as an object
            for (var j = 0; j < data.pieces[i].amount; j++) {
                tiles.push({
                    letter: data.pieces[i].letter,
                    value: data.pieces[i].value
                });
            }
        }

        // Generate tiles
        for(var i = 0; i < 7; i++) {
            var tile = $("<img></img>");
            tile.addClass("tile");
            tile.addClass("inRack");
            tile.attr("id", "tile" + i);

            // Randomly select a tile
            var randomIndex = Math.floor(Math.random() * tiles.length);

            if (tiles[randomIndex].letter == "_") {
                tile.attr("src", "../images/Scrabble_Tile_Blank.jpg");
            } else {
                tile.attr("src", "../images/Scrabble_Tile_" + tiles[randomIndex].letter +".jpg");
            }
            // tile.data("index", i);
            tile.data("tileData", tiles[randomIndex]);
            tile.data("tileID", "tile" + i);

            // Remove the tile from tiles array
            tiles.splice(randomIndex, 1);

            $("#tileRack").append(tile);
        }

        $(".tile").draggable({
            revert: function(valid) { revertTile(valid); }
        });

        // Resest score board
        board = [{}, {}, {}, {}, {}, {}, {}];
        score = 0;
        $("#word").html("Word: <span>-</span>");
        $("#score").html("Score: <span>" + score + "</span>");
        $("#remainingTiles").html("Remaining Tiles: <span>" + tiles.length + "</span>");

        // Set all slots to available
        for (var i = 0; i < 7; i++) {
            $("#slot" + i).addClass("availableSlot");
        }

        // // Load tiles data from JSON
        // $.getJSON("../pieces.json", function(entry) {
        //     $.each(entry.pieces, function (key, val) {
        //         // Push the tile as an object
        //         for (var i = 0; i < val.amount; i++) {
        //             tiles.push({
        //                 letter: val.letter,
        //                 value: val.value
        //             });
        //         }
        //     });
    
        // When we are done loading in the tiles
        // }).done(function() {

        // })
    }

    // Add more tiles to the rack based on remaining tiles
    function generateTiles() {
        // Gets next tile ID and deletes old tile
        function getNextAvailableTile() {
            // Fill array with taken IDs
            for(var i = 0; i < 7; i++) {
                if (!$.isEmptyObject(board[i])) {
                    var oldID = board[i].ID.slice(4);
                    
                    // Delete old tile
                    board[i] = {};
                    $("#tile" + oldID).remove();

                    return oldID;
                }
            }
        }

        var length = lengthOfBoard();
        for(var i = 0; i < length; i++) {
            var tile = $("<img></img>");
            tile.addClass("tile");
            tile.addClass("inRack");
            var id = getNextAvailableTile();
            tile.attr("id", "tile" + id);

            if (tiles.length > 0) {
    
                // Randomly select a tile
                var randomIndex = Math.floor(Math.random() * tiles.length);
    
                if (tiles[randomIndex].letter == "_") {
                    tile.attr("src", "../images/Scrabble_Tile_Blank.jpg");
                } else {
                    tile.attr("src", "../images/Scrabble_Tile_" + tiles[randomIndex].letter +".jpg");
                }
                tile.data("tileData", tiles[randomIndex]);
                tile.data("tileID", "tile" + id);
    
                // Remove the tile from tiles array
                tiles.splice(randomIndex, 1);
    
                $("#tileRack").append(tile);
            }
        }

        $(".tile").draggable({
            revert: function(valid) { revertTile(valid); }
        });
    }

    // Bounce the tile back to rack when not draggable not placed
    // on a valid droppable
    function revertTile(valid) {
        if (!valid) {
            var elementDragged = $(".ui-draggable-dragging");

            var rack = $("#tileRack").offset();
            rack.top += 50;
            var tile = elementDragged.offset();
            rack.left += 50;

            if (rack.top > tile.top) {
                // Move tile down
                y = rack.top - tile.top;
            } else {
                // Move tile down
                y = -((-1 * rack.top) + tile.top);
            }
            if (rack.left > tile.left) {
                // Move tile right
                x = -((-1 * rack.left) + tile.left);
            } else {
                // Move tile left
                x= rack.left - tile.left;
            }
            setTimeout(() => { 
                elementDragged.simulate("drag", {
                    dx: x,
                    dy: y
                });
            }, 10);
        }
    }



    // ========== Setup droppables ==========
    // Setup slots in the board
    $(".slot").droppable({
        drop: function(event, ui) {
            // Add draggable thst just moved in the slot to the board
            var index = $(this).attr("id").slice(4);
            board[index] = ui.draggable.data("tileData");
            board[index].ID = ui.draggable.data("tileID"); // Add ID attribute to tile object

            updateScoreBoard();

            // Remove error message if word is valid
            if (word.length >= 2) {
                $("#message").text("");
                $("#message").removeClass("errorMessage");
                $("#message").removeClass("gameOverMessage");
            }

            // Lock the ui element into position
            ui.draggable.position({
                my: 'center', 
                at: 'center',
                of: $(this)
            });

            ui.draggable.removeClass("inRack");
            
            // Only can drop one draggable into a droppable
            $(this).droppable("option", "accept", ui.draggable);  
        },
        out: function(event, ui) {
            // Remove draggable that just moved out of the slot from board
            var index = $(this).attr("id").slice(4);
            board[index] = {};
            updateScoreBoard();

            // Only can drop one draggable into a droppable
            $(this).droppable("option", "accept", ".tile");
        },
        hoverClass: "draggableHover"
    })

    // Setup tile rack (where tiles start)
    $("#tileRack").droppable({
        drop: function(event, ui) {
            // Remove the tile from board if it makes it back to the rack
            var tileID = ui.draggable.attr("id");
            var index = 0;
            for (var i = 0; i < board.length; i++) {
                if (tileID == board[i].ID) {
                    index = i;
                }
            }
            board[index] = {}
            updateScoreBoard();

            ui.draggable.addClass("inRack");
            ui.draggable.removeClass("unfrozenTile");
            
            // Lock the ui element into position
            ui.draggable.css({
                "top": "",
                "right": "",
                "bottom": "",
                "left": "",
                "position": "relative"
            });
        }
    });



    // ========== Setup button listeners ==========
    $("#nextWordButton").on("click", function() {
        // if word is valid
        if (word.length >= 2) {
            // Update score board
            $("#word").html("Word: <span>-</span>");
            score += calculateScore();
            $("#score").html("Score: <span>" + score + "</span>");
            
            if (score > highestScore) {
                highestScore = score;
            }
            $("#highestScore").html("Highest Score: <span>" + highestScore + "</span>");

            generateTiles();

            $("#remainingTiles").html("Remaining Tiles: <span>" + tiles.length + "</span>");

            updateAvailableSlots();
        } else {
            $("#message").text("The current word is too small. A word must be at least 2 tiles long.");
            $("#message").addClass("errorMessage");
        }

        // If all tiles have been used (GAME OVER)
        if (tiles.length <= 0 && $(".tile").length <= 0) {
            $("#message").text("You have used all of the remaining tiles. The game is now over. If you'd like to play again, press 'Start Over'");
            $("#message").addClass("gameOverMessage");
        }
    });
    $("#restartButton").on("click", function() {
        $("#message").text("");  // Remove game over message
        $("#message").removeClass("errorMessage");
        $("#message").removeClass("gameOverMessage");

        // Save score
        if (score > highestScore) {
            highestScore = score;
        }
        $("#highestScore").html("Highest Score: <span>" + highestScore + "</span>");

        for (var i = 0; i < 7; i++) {
            $("#tile" + i).remove();
        }

        restartGame();
    });



    // ========== Update functions (on event) ==========
    function updateScoreBoard() {
        identifyWord();
        calculateScore();
        updateAvailableSlots();
    }

    // Combine tile letters to make word
    function identifyWord() {
        word = "";
        for (var i = 0; i < board.length; i++) {
            if (!$.isEmptyObject(board[i])) {
                word += board[i].letter;
            }
        }

        $("#word").html("Word: <span>" + word + "</span>");

        // Check if word is valid or not
        if (word.length >= 2) {
            $("#word").find("span").addClass("valid");
        } else {
            $("#word").find("span").addClass("invalid");
        }
    }

    // Add up the tile scores and update score
    function calculateScore() {
        var wordScore = 0;
        for (var i = 0; i < board.length; i++) {
            if (!$.isEmptyObject(board[i])) {
                wordScore += board[i].value;
            }
        }

        // "Double Word Score" squares
        if (!$.isEmptyObject(board[1])) {
            wordScore *= 2
        }
        if (!$.isEmptyObject(board[5])) {
            wordScore *= 2
        }

        // Check if word is valid
        if ($("#word").find("span").hasClass("invalid")) {
            wordScore = 0;
        }

        $("#score").html("Score: <span>" + score + " (+" + wordScore + ")</span>");
        return wordScore;
    }

    // Highlight the slots that a tile can be dropped in
    function updateAvailableSlots() {
        // Check if the board is empty
        var empty = true;
        for (var i = 0; i < board.length; i++) {
            if (!$.isEmptyObject(board[i])) {
                empty = false;
            }
        }
        
        // Reset available slots 
        for (var i = 0; i < board.length; i++) {
            if (empty) {
                $("#slot" + i).addClass("availableSlot");
                $("#slot" + i).droppable("option", "accept", ".inRack");
            } else {
                $("#slot" + i).removeClass("availableSlot");
                $("#slot" + i).droppable("option", "accept", ".none");
            }
        }

        for (var i = 0; i < board.length; i++) {
            if (!$.isEmptyObject(board[i])) {
                // Make the slots next to a tile available
                if ($.isEmptyObject(board[i+1])) {
                    $("#slot" + (i+1)).addClass("availableSlot");
                    $("#slot" + (i+1)).droppable("option", "accept", ".inRack");
                }
                if ($.isEmptyObject(board[i-1])) {
                    $("#slot" + (i-1)).addClass("availableSlot");
                    $("#slot" + (i-1)).droppable("option", "accept", ".inRack");
                }

                // Disable dragging tiles unless they are the ones on the ends
                // of a word
                if(!$.isEmptyObject(board[i+1]) && !$.isEmptyObject(board[i-1])) {
                    $("#" + board[i].ID).draggable("disable");
                    $("#" + board[i].ID).removeClass("unfrozenTile");
                } else {
                    $("#" + board[i].ID).draggable("enable");
                    $("#" + board[i].ID).addClass("unfrozenTile");
                }
            }
        }
    }

    // Returns number of tiles in board
    function lengthOfBoard() {
        var boardLength = 0;
        for (var i = 0; i < board.length; i++) {
            if (!$.isEmptyObject(board[i])) {
                boardLength++;
            }
        }
        return boardLength;
    }
});