import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import Services from '../api/services';
import { Actions } from 'react-native-router-flux'

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: this.props.user,
      game: this.props.game
    }
    this.updateGame = this.updateGame.bind(this);
  }

  componentWillMount() {
    Services.joinGame(this.state.user.userId, this.state.game.gameId);
    Services.subscribeToGame(this.state.game.gameId, this.updateGame);
  }

  updateGame(game) {
    console.log('StartGame - updategame', game);
    this.setState({game});
  }

  startGame() {
    Services.runGame(this.state.game.gameId);
    Actions.rungame({user: this.state.user, game: this.state.game});
  }

  renderPlayers() {
    if (this.state.game.players) {
      return <View>
          <View style={{alignItems: 'center', marginTop: 10}}><H2>Players</H2></View>
          <View style={{alignItems: 'center', marginTop: 5}}><Text>Awaiting others to Join</Text></View>

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

  renderGameName() {
    if (this.state.game && this.state.game.gameName) {
      return <View style={{alignItems: 'center', marginTop: 10}}><H2>{this.state.game.gameName}</H2></View>
    }
  }
  render() {
    return (
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />
        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 100}}><H1>Game is Ready</H1></View>
          <View style={{alignItems: 'center', marginTop: 20}}><H1>{this.state.game.gameCode}</H1></View>
          {this.renderGameName()}
          {this.renderPlayers()}
          <Button style = {styles.buttonStyle} block warning onPress={()=>this.startGame()}><Text>Start at will</Text></Button>
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
