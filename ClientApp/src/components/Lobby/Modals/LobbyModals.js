import React, { Component } from 'react';
import { Button, Input, Row, Col, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { MenuModal } from './MenuModal.js'
import { PlayerListModal } from './PlayerListModal.js'

export class LobbyModals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuModalIsOpen: false,
            playerListModalIsOpen: false
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
            <div>
                <MenuModal isOpen={this.state.menuModalIsOpen} toggle={this.toggleMenuModal} />
                <PlayerListModal isOpen={this.state.playerListModalIsOpen} toggle={this.togglePlayerListModal} />
                <Button onClick={this.toggleMenuModal} size='lg'>Toggle Menu</Button>
                <Button onClick={this.togglePlayerListModal} size='lg'>Toggle Player List</Button>
            </div>
        );
    }
}