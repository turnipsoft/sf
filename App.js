import React from 'react';
import firebase from 'firebase';
import { StyleSheet, Text, View } from 'react-native';
//import LoginView from './src/views/loginview';
import RouterComponent from './src/router';

export default class App extends React.Component {

  initFirebase() {
    firebase.initializeApp({
      apiKey: "AIzaSyBCOI99f153ww95OtWdez9v3ochtpEbgjk",
      authDomain: "selfighter-1e879.firebaseapp.com",
      databaseURL: "https://selfighter-1e879.firebaseio.com",
      projectId: "selfighter-1e879",
      storageBucket: "selfighter-1e879.appspot.com",
      messagingSenderId: "767848298578"
    });

    firebase.auth().signInWithEmailAndPassword('selfighter@turnipsoft.dk','1TurnipSoft2!');
  }

  componentWillMount() {
    this.initFirebase();
  }

  render() {
    return (
      <RouterComponent />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
