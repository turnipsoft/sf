import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1, H2 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Services from '../api/services';
import GameApi from '../api/gameapi';
import CameraView from './cameraview';
import Util from '../api/util';

export default class RunGameView extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: this.props.user,
      game: this.props.game,
      selfie: null
    }
    this.updateGame = this.updateGame.bind(this);
    this.addSelfie = this.addSelfie.bind(this);
    this.handleTakePicture = this.handleTakePicture.bind(this);
  }

  componentWillMount() {
    Services.subscribeToGame(this.state.game.gameId, this.updateGame);
    Services.fetchDefaultSelfie('defaultSelfie1',(selfie)=>{
      this.setState({defaultSelfie: selfie});
    },(fail)=>{console.log('fail', fail)})
  }

  updateGame(game) {
    console.log('RunGame - updategame', game);
    this.setState({game});
    if (game.state === 'VOTING') {
      Actions.vote({user: this.state.user, game: this.state.game});
    }
  }

  voteGame() {
    Services.voteGame(this.state.game.gameId);
  }

  renderGameStatus() {
    if (this.state.game.selfies) {
      return (
        <View>
          <View style={{alignItems: 'center', marginTop: 20}}><H2>Game Status</H2></View>
          {Object.keys(this.state.game.selfies).map((user) => {
            const userStatus = user + ' has added a selfie';
            return <View key={user} style={{alignItems: 'center', marginTop: 5}}><Text>{userStatus}</Text></View>
          })}
        </View>
      )
    }
  }

  renderSelfie() {
    if (this.state.selfie) {
      const b64 = 'data:image/png;base64, '+this.state.selfie.img;
      console.log('Selfie is in the state');
      return (
        <View style={{alignItems: 'center', marginTop: 5}}>
          <Image source={{uri: b64}} style={{width:150, height:200}}/>
        </View>
      )
    }
  }

  addSelfie(base64) {
    const selfie = GameApi.getSelfie(this.state.user.userId, base64)
    Services.addSelfie(this.state.game.gameId, this.state.user.userId, selfie);
    this.setState({ selfie: selfie });
  }

  handleTakePicture(data) {
    console.log('picture', data);
    let base64Img = data.path;
    Util.getBase64(base64Img,
      (base64)=>{
        const selfie = GameApi.getSelfie(this.state.user.userId, base64)
        Services.addSelfie(this.state.game.gameId, this.state.user.userId, selfie);
        this.setState({img: data, takePicture: false, selfie: selfie}) },
      (err) => {console.log('error',err)});
  }

  render() {
    if (this.state.takePicture){
      return (
        <CameraView handleTakePicture={this.handleTakePicture} />
      )
    }

    const isOwner = this.state.game.owner === this.state.user.userId;
    const category = 'Take a selfie posing as '+this.state.game.category;

    return(
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />
        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 50}}><H1>Game is Running</H1></View>
          <View style={{alignItems: 'center', marginTop: 10}}><H2>{this.state.game.gameCode}</H2></View>
          <View style={{alignItems: 'center', marginTop: 10}}><Text>{category}</Text></View>
          {this.renderGameStatus()}

          {this.renderSelfie()}
          <Button style = {styles.buttonStyle} block warning
            onPress={ () => this.setState({takePicture: true})}><Text>Take Selfie</Text></Button>


          {this.state.img && isOwner &&
            <Button style = {styles.buttonStyle} block warning
                    onPress={ () => this.voteGame()}><Text>Vote</Text></Button>
          }
        </Content>
      </Container>);
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
