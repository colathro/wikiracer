class GameState {
    constructor() {
        this.lobby = '';
    }

    registerEventHandlers(hub, setstate) {
        hub.on("GameState", function (message) { this.gameState(setstate, message) }.bind(this));
    }

    gameState(setstate, message) {
        setstate({ game: JSON.parse(message) });
        console.log(message);
    }
}

export const Game = new GameState();