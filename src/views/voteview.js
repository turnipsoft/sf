import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Services from '../api/services';
import GameApi from '../api/gameapi';

export default class RunGameView extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: this.props.user,
      game: this.props.game,
      gamestate: this.props.game.state,
      votes: this.getVotes()
    }
    this.updateGame = this.updateGame.bind(this);
  }

  getVotes() {
    let votes = {};
    Object.keys(this.props.game.selfies).forEach((user)=> {
      votes[user] = {up:0, down:0}
    })

    return votes;
  }

  componentWillMount() {
    Services.subscribeToGame(this.state.game.gameId, this.updateGame);
  }

  updateGame(game) {
    console.log('Vote - updategame', game);
    if (game.state==='ELECTING_WINNER') {
      Actions.winner({game: this.state.game, user: this.state.user});
    }
  }

  upvote(userId) {
    let votes = this.state.votes;
    let userVotes = votes[userId];
    if (userVotes.up<5) {
      userVotes.up = userVotes.up+1;
      Services.voteSelfie(this.state.game.gameId, userId, 1, 0);
      this.setState({votes: votes});
    }
  }

  doneVoting() {
    Services.electWinnerGame(this.state.game.gameId);
  }

  downvote(userId) {
    let votes = this.state.votes;
    let userVotes = votes[userId];
    if (userVotes.down<5) {
      userVotes.down = userVotes.down+1;
      Services.voteSelfie(this.state.game.gameId, userId, 0, 1);
      this.setState({votes: votes});
    }
  }

  renderSelfie(user, selfie) {
    const b64 = 'data:image/png;base64, '+selfie.img;
    console.log('Rendering Selfie: '+user);
    const userVotes = this.state.votes[user];
    console.log(userVotes);
    return(
      <View key={user}>
        <View style={{alignItems: 'center', marginTop: 20}}><H2>{user.usedId}</H2></View>
        <Image source={{uri: b64}} style={{width:150, height:200}}/>
        <Button style = {styles.buttonStyle} block warning
          onPress={ () => this.upvote(user)}><Text>UP {userVotes.up}</Text></Button>
        <Button style = {styles.buttonStyle} block warning
          onPress={ () => this.downvote(user)}><Text>DOWN {userVotes.down}</Text></Button>
      </View>
    )
  }

  renderGameStatus() {
    if (this.state.game.selfies) {
      return (
        <View>
          <View style={{alignItems: 'center', marginTop: 20}}><H1>Selfies</H1></View>
          {Object.keys(this.state.game.selfies).map((s) => {
            return this.renderSelfie(s, this.state.game.selfies[s])
          })}
        </View>
      )
    }
  }

  render() {
    if (this.state.game) {
      const isOwner = this.state.game.owner === this.state.user.userId;
      return(
        <Container>
          <Image source={require('../images/martini.png')} style={styles.imageStyle} />
          <Content style={styles.content}>
            <View style={{alignItems: 'center', marginTop: 20}}><H1>Voting Time</H1></View>
            <View style={{alignItems: 'center', marginTop: 20}}><H2>{this.state.game.gameCode}</H2></View>
            {this.renderGameStatus()}
            {isOwner && <Button style = {styles.buttonStyle} block warning
              onPress={ () => this.doneVoting()}><Text>End Voting</Text></Button>}
            {!isOwner && <View style={{alignItems: 'center', marginTop: 20}}><Text>Awaiting Votes</Text></View>}
          </Content>
        </Container>
      )
    }
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
