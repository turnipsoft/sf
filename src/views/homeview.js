import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1 } from 'native-base';
import {Actions} from 'react-native-router-flux';

export default class HomeView extends Component {
  render() {
    return (
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />
        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 100}}><H1>Choose</H1></View>
          <Button style = {styles.buttonStyle} block warning
            onPress={()=>Actions.creategame({user: this.props.user})}>
            <Text>Start a Selfight</Text>
          </Button>
          <Button style = {styles.buttonStyle} block warning
            onPress={()=>Actions.join({user: this.props.user})}>
            <Text>Join a Selfight</Text>
          </Button>
          <Button style = {styles.buttonStyle} block warning
            onPress={()=>Actions.join({user: this.props.user})}>
            <Text>Friends</Text>
          </Button>
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
