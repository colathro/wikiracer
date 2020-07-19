import React, { Component } from "react";
import { Link } from "react-router-dom";
import { emojis } from "./EmojiList";
import { Button, Input, Row, Col, Container } from "reactstrap";
import Twemoji from "react-twemoji";
import LazyLoad from "react-lazyload";

import "./Join.scss";

const URL = window.location.hostname;

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
    fetch(
      `api/game/setname?username=${this.state.user}&avatar=${this.state.emoji}&lobby=${this.props.game.lobby}&connectionId=${this.props.hub.connectionId}`,
      { method: "POST" }
    )
      .then((r) => {
        if (r.status != 200) {
          throw new Error("Request to Join Failed.");
        }
      })
      .then(() => {
        this.props.game.me = this.state.user;
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
                <Col className="mt-3" xs="3" key={name + index}>
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
