import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import Button from '../components/button';
import { Actions } from 'react-native-router-flux';
import Services from '../api/services';
import GameApi from '../api/gameapi';


export default class ConfirmGameView extends Component {
  constructor(props) {
    super(props);
    console.log('Confirm Game');
    console.log(props);
    this.state = { group: null, users: null };
  }

  componentWillMount() {
    Services.fetchGroup(this.props.group,
      (group)=>{this.setState({group:group})},
      ()=>console.log("ouch"));
  }

  renderGroup() {
    console.log('Rendering group');
    if (this.state.group) {
      return (
        <View>
        {GameApi.asList(this.state.group.members).map((member)=>{
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
        <Text style={styles.text}>OK {this.props.username}, you chose {this.props.group}</Text>
        <Text>So if you dare to challenge these awesome Selfighters, then go ahead and press the button, unless you are chicken!</Text>
        {this.renderGroup()}
        <View style={{paddingTop: 20}}>
          <Button text="I am NOT Chicken!" onPress={()=>Actions.preparinggame({username: this.props.username,
            user: this.props.user,  group: this.state.group, groupname: this.props.group})}>
          </Button>
        </View>
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
