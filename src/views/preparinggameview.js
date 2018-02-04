import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import Button from '../components/button';
import { Actions } from 'react-native-router-flux';
import Services from '../api/services';
import GameApi from '../api/gameapi';


export default class PreparingGameView extends Component {
  constructor(props) {
    super(props);
    console.log('Preparing Game');
    console.log(props);
    this.state = { group: this.props.group, users: [], game: null };
    this.updateGame = this.updateGame.bind(this);
  }

  componentWillMount() {
    const game = GameApi.getGame(this.props.username, this.props.group, this.props.groupname);
    Services.createGame(game);
    this.setState({game});
    Services.subscribeToGame(game.gameId, this.updateGame);
    Services.joinGame(this.props.username, game.gameId);
  }

  updateGame(game) {
    console.log('game changed');
    console.log(game);
    if (game.joined) {
      this.setState({ users:Object.keys(game.joined) });
    }

  }

  renderUsers() {
    if (this.state.users) {
      return (
        <View>
        {this.state.users.map((member)=>{
          return (<View style={{paddingTop:5 }} key={member} >
            <Text>{member}</Text>
          </View>)
        })}
        </View>
      )
    }
  }

  render() {
    return(<View style={styles.view} >
      <View>
        <Text style={styles.text}>OK {this.props.username}, no way back, just waiting for all to sign in for the game</Text>
        {this.renderUsers()}
      </View>
      <View style={{paddingTop:5 }}>
        <Button text="Go!" onPress={ () => Actions.rungame({username: this.props.username, user: this.props.user,
          game: this.state.game })} />
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
