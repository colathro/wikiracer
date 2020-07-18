import React, { Component } from "react";
import { Button, Input, Row, Col } from "reactstrap";

import "./Home.scss";

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobby: "",
      lobbyError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  createGame(e) {
    console.log("Attempting to create game.");
    this.props.hub
      .invoke("CreateLobby", this.state.lobby)
      .then(() => {
        this.props.game.lobby = this.state.lobby;
        this.props.history.push("/join");
      })
      .catch((e) => {
        this.setState({ lobbyError: true });
      });
  }

  joinGame(e) {
    console.log("Attempting to join game.");
    this.props.hub
      .invoke("JoinLobby", this.state.lobby)
      .then(() => {
        this.props.game.lobby = this.state.lobby;
        this.props.history.push("/join");
      })
      .catch((e) => {
        this.setState({ lobbyError: true });
      });
  }

  handleChange(event) {
    this.setState({ lobby: event.target.value });
  }

  render() {
    return (
      <div id="home">
        <Row className="mt-3">
          <Col>
            <h1 className="text-center">WikiRacer</h1>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <div className="howto" style={{ display: "inline-block" }}>
              <p>The game is simple.</p>
              <p>
                The creator of the lobby will pick a starting and finishing wiki
                page. The first one to navigate to the finishing page is the
                winner.
              </p>
              <p>
                However, there is one catch. You can only navigate using the
                links on the pages - No searching.
              </p>
              <p>Got it? Pick a lobby name to join or create below.</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <div className="width-300" style={{ display: "inline-block" }}>
              <Input
                type="text"
                onChange={this.handleChange}
                style={{ borderColor: this.state.lobbyError ? "red" : "none" }}
              ></Input>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center">
            <Button
              className="joincreate"
              color="success"
              size="lg"
              onClick={this.joinGame}
            >
              join
            </Button>
            <Button
              className="joincreate"
              color="primary"
              size="lg"
              onClick={this.createGame}
            >
              create
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
