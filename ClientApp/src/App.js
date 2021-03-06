import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Join } from "./components/Join/Join";
import { Lobby } from "./components/Lobby/Lobby";
import { Game } from "./classes/gamestate.js";
import "./custom.css";

const signalR = require("@microsoft/signalr");

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hub: null,
      game: Game,
      page: "",
    };
  }

  componentDidMount = () => {
    let hubConn = new signalR.HubConnectionBuilder()
      .withUrl("/gamehub")
      .build();

    this.state.game.registerEventHandlers(hubConn, this.setState.bind(this));

    hubConn.start();

    this.state.game.Hub = hubConn;

    this.setState({ hub: hubConn, game: this.state.game });
  };

  render() {
    if (this.state.hub === null) {
      return <Redirect to="/"></Redirect>;
    }
    return (
      <Layout>
        <Route
          exact
          path="/"
          render={(props) => (
            <Home {...props} game={this.state.game} hub={this.state.hub} />
          )}
        />
        <Route
          exact
          path="/join"
          render={(props) => (
            <Join {...props} game={this.state.game} hub={this.state.hub} />
          )}
        />
        <Route
          exact
          path="/lobby"
          render={(props) => (
            <Lobby {...props} game={this.state.game} hub={this.state.hub} />
          )}
        />
      </Layout>
    );
  }
}
