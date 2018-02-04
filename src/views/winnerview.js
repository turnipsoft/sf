import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import Button from '../components/button';
import { Actions } from 'react-native-router-flux';
import Services from '../api/services';
import GameApi from '../api/gameapi';

export default class WinnerView extends Component {
  constructor(props) {
    super(props);
    console.log('Electing Winner');
    console.log(props);
    this.state = { game: this.props.game, votes: {}, waitingForSelfies: true };
    this.updateGame = this.updateGame.bind(this);
  }

  componentWillMount() {
    Services.voteGame(this.state.game.gameId);
    Services.subscribeToGame(this.state.game.gameId, this.updateGame);
  }

  updateGame(game) {
    this.setState( {game} );
    if (Object.keys(game.selfies).length > 0) {
      console.log('not waiting for selfies anymore');
      this.setState({waitingForSelfies: false});
    }
  }

  getWinner() {
    let winner = null;
    let winnerUserId = null
    Object.keys(this.state.game.selfies).forEach((userId) => {
      selfie = this.state.game.selfies[userId];
      if (!winner) {
        winnerUserId = userId;
        winner = selfie;
      } else {
        winnerScore = winner.upvotes-winner.downvotes;
        selfieScore = selfie.upvotes-selfie.downvotes;
        if (selfieScore>winnerScore) {
          winner = selfie;
          winnerUserId = userId;
        }
      }
    });

    return winnerUserId;
  }

  renderImage(selfie) {
    const i = 'data:image/jpg;base64,'+selfie.img;
    if (selfie.img) {
      return (
        <View style={{paddingTop: 10}}>
          <Image
            style={{width: 200, height: 300, paddingTop: 10}}
            source={{uri: i}}
            />
        </View>
      )
    }

    return (
      <View key={userId} style={{ paddingTop: 10 }}>
        <Text>{userId} have no selfie</Text>
      </View>
    )
  }

  render() {
    if (this.state.waitingForSelfies) {
      return (<View style={styles.view}>
        <Text>Waiting for Selfies to arrive</Text>
      </View>)
    }

    const winnerUserId = this.getWinner();
    const winnerSelfie = this.state.game.selfies[winnerUserId];

    return(<View style={styles.view} >
              <View>
                <Text style={styles.text}>The winner is</Text>
              </View>
              <View>
                <Text style={{fontSize:30}}>{winnerUserId}</Text>
              </View>
              {this.renderImage(winnerSelfie)}
              <View style={{paddingTop:5 }} >
                <Button text="End Game" onPress={ () => Actions.home({user: this.props.user, username: this.props.username})} />
              </View>

          </View>);
  }

}

const styles = StyleSheet.create({
  view: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    height: 20,
    fontWeight: 'bold'
  }
});
