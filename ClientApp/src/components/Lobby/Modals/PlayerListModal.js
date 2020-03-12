import React, { Component } from 'react';
import { Button, Input, Row, Col, Container, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem  } from 'reactstrap';

export class PlayerListModal extends Component {

    constructor(props) {
        super(props);
    }

  render () {
    return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>Player List</ModalHeader>
            <ModalBody>
                <div>
                    <ListGroup>
                        <ListGroupItem active>{this.props.game.Lobby.Users[0].UserName}</ListGroupItem>
                        <ListGroupItem>{this.props.game.Lobby.Users[0].UserName}</ListGroupItem>
                        <ListGroupItem>{this.props.game.Lobby.Users[0].UserName}</ListGroupItem>
                        <ListGroupItem>{this.props.game.Lobby.Users[0].UserName}</ListGroupItem>
                    </ListGroup>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.props.toggle}>Do Something</Button>{' '}
                <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
  }
}