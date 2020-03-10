class GameState {
    constructor() {
        this.lobby = '';
    }

    registerEventHandlers(hub, setstate) {
        hub.on("GameState", function (message) { this.gameState(setstate, message) }.bind(this));
    }

    gameState(setstate, message) {
        this.lobby += 'test';
        setstate({ game: this });
        console.log(message);
    }
}

export const Game = new GameState();