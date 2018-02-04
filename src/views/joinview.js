import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import {Actions} from 'react-native-router-flux';
import GameApi from '../api/gameapi';
import Services from '../api/services';

export default class JoinView extends Component {
  constructor(props) {
    super(props);
    console.log('Join Game');
    console.log(props);
    this.state = {
      user: this.props.user,
      invites : {},
      gameCode: null
    }
  }

  updateInvites(user) {
    if (user.gameinvites) {
      console.log(user.gameinvites);
      Object.keys(user.gameinvites).forEach((gameId)=>{
        Services.fetchGame(gameId,
          (game)=>{
            let gameInvites = this.state.gameInvites
            if (!gameInvites) {
              gameInvites = {}
            }
            gameInvites[gameId] = game;
            this.setState( { gameInvites } );
          },
          (fail)=>{
            console.log('fail invites', fail);
          }
        )
      })
    }
  }

  componentWillMount() {
    console.log('JOIN', this.state)
    // update user

    Services.fetchUser(this.props.user.userId,
      (user) => {
        this.setState({user});
        this.updateInvites(user);
      },
      (fail) => {console.log('failed updating user')});
  }

  startGame(gameCode) {
    if (this.state.gameCode || gameCode) {
      const gc = gameCode ? gameCode : this.state.gameCode;

      Services.getGameFromActiveGameCode(gc,
        (game)=> {
          Services.joinGame(this.state.user.userId, game.gameId);
          this.setState({game, failed: false, joining: true});
          Actions.lobby({user: this.state.user, game: game})
        },
        (fail) => {
          this.setState({failed: true, joining: false });
        });
    }

  }

  renderInvite(game) {
    const text = "You have been invited by "+game.owner;
    const text2 = "To the game "+ (game.gameName ? game.gameName : game.gameCode);

    return (
      <View key={game.gameCode}>
        <View style={{alignItems: 'center', marginTop: 5}}><Text>{text}</Text></View>
        <View style={{alignItems: 'center', marginTop: 5}}><Text>{text2}</Text></View>
        <Button style = {styles.buttonStyle} block warning
          onPress={()=>this.startGame(game.gameCode)}>
          <Text>Join</Text>
        </Button>
      </View>
    )
  }

  renderInvites() {
    if (this.state.gameInvites) {
      return (
        <View>
          <View style={{alignItems: 'center', marginTop: 10}}><H2>You have invites</H2></View>
          {Object.keys(this.state.gameInvites).map((gameId)=>{
            return (this.renderInvite(this.state.gameInvites[gameId]))
          })}
        </View>
      )
    }
  }

  render() {

    return (
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />

        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 50}}><H1>Join a game</H1></View>
          {this.renderInvites()}

          <View style={{alignItems: 'center', marginTop: 10}}><H2>Use GameCode</H2></View>
          <Form style={styles.formStyle}>
            <Item>
              <Icon active name='camera' />
              <Input placeholder="Enter GameCode" onChangeText={(text) => this.setState({ gameCode: text })}
                     value={this.state.gameCode} inputStyle={styles.input} autoCapitalize='none' autoCorrect={false}/>
            </Item>
          </Form>
          <Button style = {styles.buttonStyle} block warning
            onPress={()=>this.startGame(this.state.gameCode)}>
            <Text>Join Game</Text>
          </Button>
          {this.state.failed && <View style={{alignItems: 'center', marginTop: 10}}><Text>Unable to join game {this.state.gameCode}</Text></View> }
        </Content>
      </Container>
    );
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
