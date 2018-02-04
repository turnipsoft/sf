import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';

class Button extends PureComponent {
 render() {
    const { onPress, text } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonStyle} >
        <Text style={styles.textStyle}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  buttonStyle: {
    backgroundColor: '#fffaaa',
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff'
  },
  textStyle: {
    fontSize: 24,
    height: 40,
    fontWeight: '600',
    alignSelf: 'center',
    color: '#000',
    paddingTop: 5,
    paddingBottom: 5
  }
};

export default Button;
