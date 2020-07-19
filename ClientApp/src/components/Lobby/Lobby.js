import React, { Component } from "react";
import { WikiPage } from "./WikiPage";
import { LobbyModals } from "./Modals/LobbyModals.js";

import "./Lobby.scss";

export class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="lobby">
        <div className="wiki-container">
          <WikiPage game={this.props.game} hub={this.props.hub}></WikiPage>
        </div>
        <div className="menu-container">
          <div className="startfinish">
            <div>Start: {this.props.game.Lobby?.StartArticle}</div>
            <div>Finish: {this.props.game.Lobby?.FinishArticle}</div>
          </div>
          <div className="menuplayers">
            <div>
              <LobbyModals game={this.props.game} hub={this.props.hub} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
