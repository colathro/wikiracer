import React, { Component } from 'react';
import { Button, Input, Row, Col, Container } from 'reactstrap';
import { LobbyModals } from './Modals/LobbyModals.js'


export class Lobby extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Row style={{ 'height': '90vh', 'backgroundColor': 'red' }}>
                </Row>
                <Row className='align-items-center' style={{ 'height': '10vh', 'backgroundColor': 'yellow' }}>
                    <Col>
                    </Col>
                    <Col>
                        <LobbyModals game={this.props.game} lang={this.props.lang} hub={this.props.hub} />
                    </Col>
                </Row>
            </Container>
        );
    }
}