import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Input, Row, Col } from 'reactstrap';


export class HowTo extends Component {

    constructor(props) {
        super(props);

        this.home = this.home.bind(this);
    }

    home(e) {
        console.log('Navigating Home.');
        this.props.history.push('/');
    }

    render() {
        return (
            <div className='container'>
                <Row className='mt-3'>
                    <Col className='text-center'>
                        <h1>{this.props.lang.howtoplay}</h1>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <p>The game is simple.</p>
                        <p>The creator of the lobby will pick a starting Wikipedia page, and a finishing Wikipedia page.
                            The first one to navigate to the finishing page is the winner.</p>
                        <p>However, there is one catch. You can only navigate using the links on the pages - No searching.</p>
                        <p>Got it? Head back to the menu to create or join a lobby.</p>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col className='text-center'>
                        <Button className='width-300' color='primary' size='lg' onClick={this.home}>Back</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}