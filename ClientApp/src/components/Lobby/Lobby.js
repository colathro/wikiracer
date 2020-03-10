import React, { Component } from 'react';
import { Button, Input, Row, Col, Container } from 'reactstrap';

export class Lobby extends Component {

    constructor(props) {
        super(props);
    }

  render () {
    return (
        <Container>
            <Row style={{ 'height': '10vh', 'background-color' : 'blue' }}>
            </Row>
            <Row style={{ 'height': '80vh', 'background-color': 'red'}}>
            </Row>
            <Row style={{ 'height': '10vh', 'background-color': 'yellow' }}>
            </Row>
        </Container>
    );
  }
}