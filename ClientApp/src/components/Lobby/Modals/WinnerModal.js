import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export class WinnerModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal centered isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Winner!</ModalHeader>
        <ModalBody>{this.props.game.Lobby.Winner}</ModalBody>
      </Modal>
    );
  }
}
