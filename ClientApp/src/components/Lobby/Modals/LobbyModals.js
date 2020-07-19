import React, { Component } from "react";
import { Button } from "reactstrap";
import { MenuModal } from "./MenuModal.js";
import { PlayerListModal } from "./PlayerListModal.js";

import "./LobbyModals.scss";

export class LobbyModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuModalIsOpen: false,
      playerListModalIsOpen: false,
    };

    this.toggleMenuModal = this.toggleMenuModal.bind(this);
    this.togglePlayerListModal = this.togglePlayerListModal.bind(this);
  }

  toggleMenuModal() {
    this.setState({ menuModalIsOpen: !this.state.menuModalIsOpen });
  }

  togglePlayerListModal() {
    this.setState({ playerListModalIsOpen: !this.state.playerListModalIsOpen });
  }

  render() {
    return (
      <>
        <MenuModal
          isOpen={this.state.menuModalIsOpen}
          toggle={this.toggleMenuModal}
          game={this.props.game}
          hub={this.props.hub}
        />
        <PlayerListModal
          isOpen={this.state.playerListModalIsOpen}
          toggle={this.togglePlayerListModal}
          game={this.props.game}
        />
        {this.props.game.Lobby?.Host === this.props.game.me ? (
          <Button
            color="success"
            className="lobbybutton"
            onClick={this.toggleMenuModal}
          >
            Menu
          </Button>
        ) : (
          <> </>
        )}
        <Button
          color="primary"
          className="lobbybutton"
          onClick={this.togglePlayerListModal}
        >
          Players
        </Button>
      </>
    );
  }
}
