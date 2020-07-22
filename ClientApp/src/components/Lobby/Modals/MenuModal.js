import React, { Component } from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from "reactstrap";

export class MenuModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: "",
      finish: "",
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeFinish = this.handleChangeFinish.bind(this);
    this.setStartFinish = this.setStartFinish.bind(this);
    this.setRandomStartFinish = this.setRandomStartFinish.bind(this);
  }

  componentDidMount() {}

  setStartFinish() {
    this.props.hub
      .invoke(
        "SetStartAndFinish",
        this.props.game.Lobby.LobbyName,
        this.state.start,
        this.state.finish
      )
      .then(() => {
        console.log(
          `Set Start: ${this.state.start} and Finish: ${this.state.finish}`
        );
      });
  }

  setRandomStartFinish() {
    this.props.hub
      .invoke("RandomizeStartAndFinish", this.props.game.Lobby.LobbyName)
      .then(() => {
        console.log("Randomized Start and Finish.");
      });
  }

  startGame() {
    this.props.hub
      .invoke("StartGame", this.props.game.Lobby.LobbyName)
      .then(() => {
        console.log("Starting Game.");
      });
  }

  handleChangeStart(event) {
    this.setState({ start: event.target.value });
  }

  handleChangeFinish(event) {
    this.setState({ finish: event.target.value });
  }

  render() {
    return (
      <Modal centered isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Lobby Settings</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Start</InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              onChange={this.handleChangeStart}
              defaultValue={this.props.game.Lobby?.StartArticle}
            ></Input>
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Finish</InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              onChange={this.handleChangeFinish}
              defaultValue={this.props.game.Lobby?.FinishArticle}
            ></Input>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.setStartFinish}>
            Submit Settings
          </Button>{" "}
          <Button color="secondary" onClick={this.setRandomStartFinish}>
            Random Settings
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
