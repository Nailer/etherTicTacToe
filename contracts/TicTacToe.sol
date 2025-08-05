// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TicTacToe {
    struct Game {
        address player1;
        address player2;
        address currentPlayer;
        uint8[9] board; // 0 = empty, 1 = player1 (X), 2 = player2 (O)
        address winner;
        bool isActive;
        uint256 betAmount;
    }
    
    mapping(uint256 => Game) public games;
    uint256 public gameCounter;
    
    event GameCreated(uint256 indexed gameId, address indexed player1, uint256 betAmount);
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event MoveMade(uint256 indexed gameId, address indexed player, uint8 position);
    event GameEnded(uint256 indexed gameId, address indexed winner);
    
    function createGame() external payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        uint256 gameId = gameCounter++;
        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            currentPlayer: msg.sender,
            board: [0,0,0,0,0,0,0,0,0],
            winner: address(0),
            isActive: false,
            betAmount: msg.value
        });
        
        emit GameCreated(gameId, msg.sender, msg.value);
        return gameId;
    }
    
    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.player1 != address(0), "Game does not exist");
        require(game.player2 == address(0), "Game already has two players");
        require(msg.value == game.betAmount, "Incorrect bet amount");
        require(msg.sender != game.player1, "Cannot join your own game");
        
        game.player2 = msg.sender;
        game.isActive = true;
        
        emit GameJoined(gameId, msg.sender);
    }
    
    function makeMove(uint256 gameId, uint8 position) external {
        Game storage game = games[gameId];
        require(game.isActive, "Game is not active");
        require(msg.sender == game.currentPlayer, "Not your turn");
        require(position < 9, "Invalid position");
        require(game.board[position] == 0, "Position already taken");
        
        uint8 playerNumber = (msg.sender == game.player1) ? 1 : 2;
        game.board[position] = playerNumber;
        
        emit MoveMade(gameId, msg.sender, position);
        
        address winner = checkWinner(gameId);
        if (winner != address(0)) {
            game.winner = winner;
            game.isActive = false;
            
            // Transfer winnings to winner (minus platform fee)
            uint256 totalPot = game.betAmount * 2;
            uint256 platformFee = totalPot * 5 / 100; // 5% platform fee
            uint256 winnings = totalPot - platformFee;
            
            payable(winner).transfer(winnings);
            emit GameEnded(gameId, winner);
        } else if (isBoardFull(gameId)) {
            // Tie game - refund both players
            game.isActive = false;
            payable(game.player1).transfer(game.betAmount);
            payable(game.player2).transfer(game.betAmount);
            emit GameEnded(gameId, address(0));
        } else {
            // Switch turns
            game.currentPlayer = (game.currentPlayer == game.player1) ? game.player2 : game.player1;
        }
    }
    
    function checkWinner(uint256 gameId) internal view returns (address) {
        Game storage game = games[gameId];
        uint8[9] memory board = game.board;
        
        // Check rows, columns, and diagonals
        uint8[3][8] memory winningCombinations = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];
        
        for (uint i = 0; i < 8; i++) {
            uint8 a = winningCombinations[i][0];
            uint8 b = winningCombinations[i][1];
            uint8 c = winningCombinations[i][2];
            
            if (board[a] != 0 && board[a] == board[b] && board[a] == board[c]) {
                return (board[a] == 1) ? game.player1 : game.player2;
            }
        }
        
        return address(0);
    }
    
    function isBoardFull(uint256 gameId) internal view returns (bool) {
        Game storage game = games[gameId];
        for (uint i = 0; i < 9; i++) {
            if (game.board[i] == 0) {
                return false;
            }
        }
        return true;
    }
    
    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }
}
