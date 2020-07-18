import React, { Component } from "react";
import { Link } from "react-router-dom";
import { emojis } from "./EmojiList";
import { Button, Input, Row, Col, Container } from "reactstrap";
import Twemoji from "react-twemoji";
import LazyLoad from "react-lazyload";

import "./Join.scss";

export class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      emoji: null,
    };

    this.setEmojiAvatar = this.setEmojiAvatar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  handleChange(event) {
    this.setState({ user: event.target.value });
  }

  setEmojiAvatar(name) {
    this.setState({ emoji: name });
  }

  joinGame() {
    this.props.hub
      .invoke(
        "SetUsernameAndAvatar",
        this.state.user,
        this.state.emoji,
        this.props.game.lobby
      )
      .then(() => {
        this.props.history.push("/lobby");
      });
  }

  render() {
    return (
      <div id="join" className="container text-center">
        <div className="mt-3">pick a nickname and icon</div>
        <div className="mt-3 width-300" style={{ display: "inline-block" }}>
          <Input type="text" onChange={this.handleChange}></Input>
        </div>
        <br />
        <Container className="emoji-container">
          <Row>
            {emojis.map(function (name, index) {
              return (
                <Col className="mt-2" xs="2" key={name + index}>
                  <div
                    className={
                      this.state.emoji === name
                        ? "selected twemoji-container"
                        : "unselected twemoji-container"
                    }
                    onClick={() => this.setEmojiAvatar(name)}
                  >
                    <Twemoji options={{ className: "twemoji" }}>{name}</Twemoji>
                  </div>
                </Col>
              );
            }, this)}
          </Row>
        </Container>
        <div className="mt-3">
          <Button
            className="width-300 mt-3"
            color="primary"
            size="lg"
            onClick={this.joinGame}
          >
            continue
          </Button>
        </div>
      </div>
    );
  }
}
