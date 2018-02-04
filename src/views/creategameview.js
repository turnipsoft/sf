import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import Services from '../api/services';
import GameApi from '../api/gameapi';
import { Actions } from 'react-native-router-flux'

export default class CreateGameView extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: this.props.user,
      gameName: '',
      game: null,
      failedGameCode: false
    }
  }

  componentWillMount() {
    Services.getUserFriends(this.state.user.userId,
      (friends)=>{
        this.setState({friends});
      },
      (fail)=> {
        this.setState({friends: null});
      }
    )
  }

  invite(friendId) {
    Services.inviteUserToGame(friendId, this.state.game.gameId);
    let friends = this.state.friends;
    friends[friendId] = null;
    this.setState({invited: friendId, friends});
  }

  renderInviteFriend(friendId, state) {
    if (state==='PENDING' || state===null) {
      return null;
    }

    return (
      <Button key={friendId} success block style={styles.friendButtonStyle}
              onPress={()=>this.invite(friendId)}><Text>Invite {friendId}</Text></Button>
    )
  }

  renderInviteFriends() {
    if (this.state.friends) {
      return (
        <View>
          <View style={{alignItems: 'center', marginTop: 100}}><H1>Invite Friends</H1></View>
          {Object.keys(this.state.friends).map((friend)=> {
            return this.renderInviteFriend(friend, (this.state.friends[friend]))
          })}
        </View>
      )
    }
  }

  createGameWithGameCodeAndName(gameCode, gameName) {
    const game = GameApi.getGame(this.state.user.userId, gameCode, gameName);
    Services.createGame(game);
    Services.createActiveGame(game);
    this.setState({ game });
  }

  startGame() {
    Actions.startgame({user: this.state.user, game: this.state.game})
  }

  createGame() {
    let gameCode = GameApi.getRandomGameCode();
    Services.getActiveGame(gameCode,
      (activeGame) => {
        if (activeGame) {
          this.createGame();
        } else {
          this.setState({failedGameCode: false});
          this.createGameWithGameCodeAndName(gameCode, this.state.gameName);
        }
      },
      (fail) => {
        this.setState({failedGameCode: false});
        this.createGameWithGameCodeAndName(gameCode, this.state.gameName);
      }
    );
  }

  renderGameName() {
    if (this.state.game && this.state.game.gameName) {
      return (<View style={{alignItems: 'center', marginTop: 10}}><H2>{this.state.game.gameName}</H2></View>)
    }
  }

  render() {
    if (this.state.game) {
      const text = 'Invited '+this.state.invited;

      return(
        <Container>
          <Image source={require('../images/martini.png')} style={styles.imageStyle} />
          <Content style={styles.content}>
            <View style={{alignItems: 'center', marginTop: 100}}><H1>Game is Ready</H1></View>
            <View style={{alignItems: 'center', marginTop: 20}}><H1>{this.state.game.gameCode}</H1></View>
            {this.renderGameName()}
            {this.renderInviteFriends()}
            {this.state.invited && <View style={{alignItems: 'center', marginTop: 20}}><Text>{text}</Text></View>}
            <Button style={styles.buttonStyle}
                    block warning onPress={()=>this.startGame()}><Text>Start Game</Text></Button>
          </Content>
        </Container>
      )
    }

    return (
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />
        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 100}}><H1>Create Game</H1></View>
          <Form style={styles.formStyle}>
            <Item>
              <Icon active name='camera' />
              <Input placeholder="Name of game (optional)" onChangeText={(text) => this.setState({ gameName: text })}
                     value={this.state.gameName} inputStyle={styles.input} autoCapitalize='none' autoCorrect={false}/>
            </Item>
          </Form>
          <Button style = {styles.buttonStyle}  block warning onPress={()=>this.createGame()}><Text>Create Game</Text></Button>
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
  friendButtonStyle: {
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100
  },
  contentStyle: {
    marginTop: 100
  }
});
