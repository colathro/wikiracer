import React, { Component } from 'react';
import Twemoji from 'react-twemoji';
import { Button, Input, Row, Col, Container, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem  } from 'reactstrap';

export class PlayerListModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var users = this.props.game.Lobby.Users.map(function (user) {
            return (
                <ListGroupItem>
                    <div className='mx-auto'>
                        <Twemoji options={{ className: 'twemoji mr-4' }} tag={'span'}>
                            {user.Avatar}
                        </Twemoji>
                        <span className='h4'>
                            {user.UserName}
                        </span>
                     </div>
                </ListGroupItem>
                    );
        });
    return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>Player List</ModalHeader>
            <ModalBody>
                <div>
                    <ListGroup>
                        {users}
                    </ListGroup>
                </div>
            </ModalBody>
        </Modal>
    );
  }
}