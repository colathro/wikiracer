import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { emojis } from './EmojiList';
import { Button, Input, Row, Col, Container } from 'reactstrap';
import Twemoji from 'react-twemoji';
import LazyLoad from 'react-lazyload';

function selected() {
    return 'btn-outline-dark';
}

function unselected() {
    return 'btn-light';
}

export class Join extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            emoji: null
        };

        this.setEmojiAvatar = this.setEmojiAvatar.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }

    handleChange(event) {
        this.setState({ user: event.target.value })
    }

    setEmojiAvatar(name) {
        this.setState({emoji: name});
    }

    joinGame() {
        this.props.hub.invoke("SetUsernameAndAvatar", this.state.user, this.state.emoji, this.props.game.lobby).then(() => {
            this.props.history.push('/lobby');
        });
    }

    render() {
        return (
            <div className='container text-center'>
                <h1>Join</h1>
                <div className='width-300' style={{ 'display': 'inline-block' }}>
                    <Input type='text' onChange={this.handleChange}></Input>
                </div>
                <Link to='/'>Back</Link>
                <br />
                <Container style={{ 'overflow': 'scroll', 'height': '450px'}}>
                    <Row>
                        {emojis.map(function (name, index) {
                            var className = unselected();
                            if (this.state.emoji === name) {
                                className = selected();
                            }
                            return (
                                <Col className='mt-2' key={name + index} style={{'width': '70px'}}>
                                    <Button className={className} onClick={() => this.setEmojiAvatar(name)}>
                                        <Twemoji options={{ className: 'twemoji' }}>
                                            {name}
                                        </Twemoji>
                                    </Button>
                                </Col>);
                        }, this)}
                    </Row>
                </Container>
                <Button className='width-300 mt-3' color='primary' size='lg' onClick={this.joinGame}>
                    {this.props.lang.continue}
                </Button>
            </div>
        );
    }
}