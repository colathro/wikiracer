import React, { Component } from 'react';
import { Button, ButtonGroup, Input, Row, Col } from 'reactstrap';
import Twemoji from 'react-twemoji';


export class Languages extends Component {
    constructor(props) {
        super(props);
        this.setLang = this.setLang.bind(this);
        this.selected = 'btn-outline-dark';
        this.unselected = 'btn-light';

        this.state = {
            'en': props.lang._language === 'en' ? this.selected : this.unselected,
            'pt': props.lang._language === 'pt' ? this.selected : this.unselected,
            'ch': props.lang._language === 'ch' ? this.selected : this.unselected,
            'fr': props.lang._language === 'fr' ? this.selected : this.unselected,
            'jp': props.lang._language === 'jp' ? this.selected : this.unselected,
            'ru': props.lang._language === 'ru' ? this.selected : this.unselected
        }
    }

    setLang(lang) {
        this.props.lang.setLanguage(lang);
        this.props.callBack();
        this.setState({
            'en': lang === 'en' ? this.selected : this.unselected,
            'pt': lang === 'pt' ? this.selected : this.unselected,
            'ch': lang === 'ch' ? this.selected : this.unselected,
            'fr': lang === 'fr' ? this.selected : this.unselected,
            'jp': lang === 'jp' ? this.selected : this.unselected,
            'ru': lang === 'ru' ? this.selected : this.unselected
        });
    }

    render() {
        return (
            <ButtonGroup>
                <Button className={this.state.en} onClick={() => this.setLang('en')}>
                    <Twemoji options={{ className: 'twemoji' }}>
                    🇺🇸
                    </Twemoji>
                </Button>
                <Button className={this.state.pt} onClick={() => this.setLang('pt')}>
                    <Twemoji options={{ className: 'twemoji', style:{ 'width': '30px'} }}>
                    🇧🇷
                    </Twemoji>
                </Button>
                <Button className={this.state.ch} onClick={() => this.setLang('ch')}>
                    <Twemoji options={{ className: 'twemoji' }}>
                    🇨🇳
                    </Twemoji>
                </Button>
                <Button className={this.state.fr} onClick={() => this.setLang('fr')}>
                    <Twemoji options={{ className: 'twemoji' }}>
                    🇫🇷
                    </Twemoji>
                </Button>
                <Button className={this.state.jp} onClick={() => this.setLang('jp')}>
                    <Twemoji options={{ className: 'twemoji' }}>
                    🇯🇵
                    </Twemoji>
                </Button>
                <Button className={this.state.ru} onClick={() => this.setLang('ru')}>
                    <Twemoji options={{ className: 'twemoji' }}>
                    🇷🇺
                    </Twemoji>
                </Button>
            </ButtonGroup>
        );
    }
}