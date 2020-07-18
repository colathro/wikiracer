import React, { Component } from "react";
import Twemoji from "react-twemoji";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export class PlayerListModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.game.Lobby != null) {
      var users = this.props.game.Lobby.Users.map(function (user) {
        return (
          <ListGroupItem>
            <div className="mx-auto">
              <Twemoji options={{ className: "twemoji mr-4" }} tag={"span"}>
                {user.Avatar}
              </Twemoji>
              <span className="h4">{user.UserName}</span>
            </div>
          </ListGroupItem>
        );
      });
    }

    return (
      <Modal centered isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Player List</ModalHeader>
        <ModalBody>
          <div style={{ overflowY: "scroll", maxHeight: "30vh" }}>
            <ListGroup>{users}</ListGroup>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
