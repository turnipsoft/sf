import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, H1 } from 'native-base';
import Services from '../api/services';
import { Actions } from 'react-native-router-flux'

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state={username:'arvitski', password:'arvitski', loggedIn: false};
  }

  login() {
    if (this.state.username && this.state.password) {
       Services.fetchUser(this.state.username.toLowerCase(),
        ((user) => {
          if (user && user.password.toLowerCase() ===
          this.state.password.toLowerCase()) {
            console.log('User is logged in');
            this.setState({ loggedIn: true });
            Actions.home({user: user, username: this.state.username});
          }
        }),
        ((username) => {
          console.log('User is not logged in');
          this.setState({ loggedIn: false, loginFailed: true });
        })
      );

    }
  }

  render() {

    return (
      <Container>
        <Image source={require('../images/martini.png')} style={styles.imageStyle} />
        <Content style={styles.content}>
          <View style={{alignItems: 'center', marginTop: 100}}><H1>Login</H1></View>
          <Form style={styles.formStyle}>
            <Item error={this.state.loginFailed} >
              <Icon active name='person' />
              <Input placholder="Username" onChangeText={(text) => this.setState({ username: text })}
                     value={this.state.username} inputStyle={styles.input} autoCapitalize='none' autoCorrect={false}/>
              {this.state.loginFailed && <Icon name='close-circle' />}
            </Item>
            <Item error={this.state.loginFailed} >
              <Icon active name='lock' />
              <Input placholder="Password" onChangeText={(text) => this.setState({ password: text })}
                     value={this.state.password} inputStyle={styles.input} autoCapitalize='none' autoCorrect={false} />
              {this.state.loginFailed && <Icon name='close-circle' />}
            </Item>

          </Form>
          <Button style = {styles.buttonStyle} bordered block dark onPress={()=>this.login()}><Text> Login </Text></Button>

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
