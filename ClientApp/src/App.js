import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { HowTo } from './components/HowTo/HowTo';
import { Join } from './components/Join/Join';
import { Lobby } from './components/Lobby/Lobby';
import { Game } from './classes/gamestate.js';
import { Strings } from './classes/localization.js';
import './custom.css'

const signalR = require("@aspnet/signalr");

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hub : null,
            strings : Strings,
            game : Game
        };
    }

    componentDidMount = () => {
        let hubConn = new signalR.HubConnectionBuilder()
            .withUrl("/gamehub")
            .build();

        hubConn.on("ReceiveMessage", function (message) { console.log(message); });

        hubConn.start();

        this.setState({ hub : hubConn });
    }

    render() {
        if (this.state.hub === null) {
            return (<Redirect to='/'></Redirect>);
        }
    return (
        <Layout>
            <Route exact path='/' render={(props) => <Home {...props} lang={this.state.strings} game={this.state.game} hub={this.state.hub} />} />
            <Route exact path='/howto' render={(props) => <HowTo {...props} lang={this.state.strings} game={this.state.game} hub={this.state.hub} />} />
            <Route exact path='/join' render={(props) => <Join {...props} lang={this.state.strings} game={this.state.game} hub={this.state.hub} />} />
            <Route exact path='/lobby' render={(props) => <Lobby {...props} lang={this.state.strings} game={this.state.game} hub={this.state.hub} />} />
      </Layout>
    );
  }
}
