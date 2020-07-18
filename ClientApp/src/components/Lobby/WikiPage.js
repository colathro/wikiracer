import React, { Component } from "react";
import { Spinner } from "reactstrap";
import { Game } from "../../classes/gamestate";

import "./WikiPage.scss";

export class WikiPage extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: "", navigating: true };
  }

  componentDidUpdate() {
    if (Game.Page !== this.state.currentPage) {
      this.setState({ currentPage: Game.Page, navigating: false });
    }
  }

  render() {
    return (
      <div id="wikipage">
        {this.state.navigating ? (
          <Spinner color="primary" />
        ) : (
          <div>{this.state.currentPage}</div>
        )}
      </div>
    );
  }
}
