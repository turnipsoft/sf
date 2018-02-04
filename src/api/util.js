import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export default class Utils {

  static getBase64(path, succes, fail) {
    RNFS.readFile(Platform.OS === 'android'? base64Img.substring(7): path, "base64")  //substring(7) -> to remove the file://
        .then(res => {
            succes(res);
          })
        .catch(err => fail(err));
  }
}
