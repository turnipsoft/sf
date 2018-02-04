import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import {Actions} from 'react-native-router-flux';
import GameApi from '../api/gameapi';
import Services from '../api/services';

export default class LobbyView extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: this.props.user,
      game: this.props.game
    }
    this.updateGame = this.updateGame.bind(this);
  }

  componentWillMount() {
    Services.subscribeToGame(this.state.game.gameId, this.updateGame);
  }

  updateGame(game) {
    console.log('lobby - updategame', game);
    this.setState({game});
    if (game.state==='RUNNING') {
      Actions.rungame({user: this.state.user, game: this.state.game});
    }
  }

  renderPlayers() {
    if (this.state.game.players) {
      return <View>
        <View style={{alignItems: 'center', marginTop: 10}}><H2>Joined Players</H2></View>
        {Object.keys(this.state.game.players).map((p)=>{
          return (
            <View key={p} style={{alignItems: 'center', marginTop: 10}}>
              <Text>{p} - {this.state.game.players[p]}</Text>
            </View>
          )
        })}
      </View>

    }
  }

  render() {
      return(
        <Container>
          <Image source={require('../images/martini.png')} style={styles.imageStyle} />

          <Content style={styles.content}>
            <View style={{alignItems: 'center', marginTop: 50}}><H1>Waiting for game to start</H1></View>
            <View style={{alignItems: 'center', marginTop: 50}}><H2>{this.state.game.gameCode}</H2></View>

            {this.renderPlayers()}
          </Content>
        </Container>
      )
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  formStyle: {
    marginLeft: 30,
    marginRight: 50,
    marginTop: 100
  },
  buttonStyle: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40
  },
  contentStyle: {
    marginTop: 100
  }
});
