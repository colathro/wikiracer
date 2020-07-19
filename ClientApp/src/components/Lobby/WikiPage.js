import React, { Component } from "react";
import { Spinner } from "reactstrap";
import { Game } from "../../classes/gamestate";

import "./WikiPage.scss";

const URL = window.location.hostname;

export class WikiPage extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: "", navigating: true };
  }

  componentDidUpdate() {
    if (this.props.game.Page !== this.state.currentPage) {
      this.setState({ currentPage: this.props.game.Page, navigating: false });
      return;
    }

    let nodes = this.getElementByAttribute("resolve");
    for (let i = 0; i < nodes.length; i++) {
      //create pointer outside of the onclick event allowing closure
      let page = nodes[i].getAttribute("resolve");

      nodes[i].addEventListener("click", (e) => {
        if (page) this.setNavigatingAndCallPage(page);
      });

      //remove the custom attribute to cleanup
      nodes[i].removeAttribute("resolve");
    }
  }

  getElementByAttribute(attr) {
    let nodeList = document.getElementsByTagName("*");
    let nodeArray = [];
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].getAttribute(attr)) nodeArray.push(nodeList[i]);
    }
    return nodeArray;
  }

  setNavigatingAndCallPage(page) {
    fetch(
      URL +
        `/api/wikipage?page=${page}&lobby=${this.props.game.Lobby.LobbyName}&connectionId=${this.props.hub.connectionId}`
    );
    this.setState({ navigating: true });
  }

  setpage(pageData) {}

  render() {
    return (
      <div id="wikipage">
        {this.state.navigating ? (
          <Spinner color="primary" />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: this.state.currentPage }}
          ></div>
        )}
      </div>
    );
  }
}
