import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { HowTo } from './components/HowTo/HowTo';
import { Join } from './components/Join/Join';
import { Lobby } from './components/Lobby/Lobby';
import { Game } from './classes/gamestate.js';
import { Strings } from './classes/localization.js';
import './custom.css'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.Game = Game;
        this.Strings = Strings;
    }

  render () {
    return (
      <Layout>
            <Route exact path='/' render={(props) => <Home {...props} lang={this.Strings}/>} />
            <Route exact path='/howto' render={(props) => <HowTo {...props} lang={this.Strings}/>} />
            <Route exact path='/join' render={(props) => <Join {...props} lang={this.Strings}/>} />
            <Route exact path='/lobby' render={(props) => <Lobby {...props} lang={this.Strings}/>} />
      </Layout>
    );
  }
}
