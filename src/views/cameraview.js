import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Vibration } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from 'react-native-camera'

export default class CameraView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      front: true
    }
  }

  render() {
    const type = this.state.front ? Camera.constants.Type.front : Camera.constants.Type.back;

    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam
          }}
          style={styles.view}
          type={type}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.disk}
          captureQuality={Camera.constants.CaptureQuality.medium} >
            <View style={{alignItems: 'center', marginBottom: 80}}>
              <Button bordered dark style = {styles.buttonStyle} onPress={this.takePicture.bind(this)}>
                <Icon name='bullseye' color='#FFFFFF' size={50} />
              </Button>
              <Button bordered dark style = {styles.buttonStyle} onPress={()=>this.setState({front: !this.state.front})}>
                <Icon name='camera' color='#FFFFFF' size={40} />
              </Button>
            </View>
        </Camera>
      </View>
    );
  }

  takePicture() {
    const options = {}

    this.camera.capture({metadata: options}).then((data) => {
      console.log(data)
      this.props.handleTakePicture(data);
    }).catch((error) => {
      console.log(error)
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  view: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: 'steelblue',
    borderRadius: 10,
    color: 'red',
    padding: 15,
    margin: 45
  },
  buttonStyle: {
    marginLeft: 5,
    marginRight: 5,
    marginTop:5,
    marginBottom: 5,
    alignItems: 'center'
  }
});
