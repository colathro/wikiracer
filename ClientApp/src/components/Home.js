import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Input, Row, Col } from 'reactstrap';
import { Languages } from './Languages';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            lobby: '',
            lang: this.props.lang
        };

        this.handleChange = this.handleChange.bind(this)
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.howTo = this.howTo.bind(this);
        this.updateLang = this.updateLang.bind(this);
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

    handleChange(event) {
        this.setState({lobby: event.target.value})
    }

    updateLang() {
        this.setState({
            lobby: this.state.lobby,
            lang: this.state.lang
        });
    }


    render() {
        return (
            <div>
                <Row>
                    <Col className='text-center'>
                        <Languages lang={this.state.lang} callBack={this.updateLang} />
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center mt-4 mb-4'>
                        <img src='/content/wikilogo.png' style={{ 'width': '276px', 'height': '256px' }}></img>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className='text-center'>WikiRacer</h1>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col className='text-center'>
                        <Button className='width-300' color='primary' size='lg' onClick={this.howTo}>
                            {this.state.lang.howtoplay}
                        </Button>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col className='text-center'>
                        <div className='width-300' style={{ 'display': 'inline-block' }}>
                            <Input type='text' onChange={this.handleChange}></Input>
                        </div>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col className='text-center'>
                        <Button className='width-300' color='success' size='lg' onClick={this.joinGame}>
                            {this.state.lang.join}
                        </Button>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col className='text-center'>
                        <Button className='width-300' color='primary' size='lg' onClick={this.createGame}>
                            {this.state.lang.create}
                        </Button>
                    </Col>
                </Row>
          </div>
        );
  }
}
