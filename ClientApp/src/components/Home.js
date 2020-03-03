import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Input, Row, Col } from 'reactstrap';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.howTo = this.howTo.bind(this);
    }

    createGame(e) {
        console.log('Attempting to create game.');
        this.props.history.push('/join');
    }

    joinGame(e) {
        console.log('Attempting to join game.');
        this.props.history.push('/join');
    }

    howTo() {
        console.log('Attempting to join game.');
        this.props.history.push('/howto');
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className='text-center'>Wikiracer</h1>
                    </Col>
                </Row>

                <Row>
                    <Col className='text-center'>
                        <Button className='width-300' color='primary' size='lg' onClick={this.howTo}>How To Play</Button>
                    </Col>
                </Row>

                <Row>
                    <Col className='text-center'>
                        <div className='width-300'>
                            <Input type='text'></Input>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col className='text-center'>
                        <Button className='width-300' color='success' size='lg' onClick={this.joinGame}>
                            Join
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col className='text-center'>
                        <Button className='width-300' color='primary' size='lg' onClick={this.createGame}>
                            Create
                        </Button>
                    </Col>
                </Row>
          </div>
        );
  }
}
