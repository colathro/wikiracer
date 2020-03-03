import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { HowTo } from './components/HowTo/HowTo';
import { Join } from './components/Join/Join';
import { Lobby } from './components/Lobby/Lobby';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
            <Route exact path='/' component={Home} />
            <Route exact path='/howto' component={HowTo} />
            <Route exact path='/join' component={Join} />
            <Route exact path='/lobby' compontent={Lobby} />
      </Layout>
    );
  }
}
