import CategoryApi from './categoryapi';

export default class GameApi {

  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomGameCode() {
    const digit1=GameApi.getRandomInt(65,90);
    const digit2=GameApi.getRandomInt(65,90);
    const digit3=GameApi.getRandomInt(65,90);
    const digit4=GameApi.getRandomInt(65,90);

    const result=String.fromCharCode(digit1)+String.fromCharCode(digit2)+String.fromCharCode(digit3)+String.fromCharCode(digit4)
    return result;
  }

  static getGameId(username) {
    return username+'_'+GameApi.uuidv4();
  }

  static getGame(username, gameCode, gameName) {
    return {
      gameId : GameApi.getGameId(username),
      gameCode,
      gameName,
      owner: username,
      state: 'CREATED',
      players: {},
      selfies: {},
      category: CategoryApi.getCategory()
    }
  }

  static getUser(username, password, email) {
    return {
      username,
      userId: username,
      gameinvites: {},
      email,
      password
    }
  }

  static getCategory() {

  }

  static getSelfie(userId, selfie) {
    return {
      img: selfie,
      upvotes: 0,
      downvotes: 0,
      rank: 0
    }
  }
}
