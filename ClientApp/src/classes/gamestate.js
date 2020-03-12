class GameState {
    constructor() {
        this.lobby = '';
    }

    registerEventHandlers(hub, setstate) {
        console.log("registering gamestate");
        hub.on("GameState", function (message) { this.gameState(setstate, message) }.bind(this));
        console.log("registered gamestate");
    }

    gameState(setstate, message) {
        setstate({ game: JSON.parse(message) });
        console.log(message);
    }
}

export const Game = new GameState();