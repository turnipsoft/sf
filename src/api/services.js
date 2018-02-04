import firebase from 'firebase';

export default class Services {

  registerUser(username, password, email, realname, success, fail) {
    firebase.database().ref('/users/'+username)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          fail(snapshot.val());
        } else {
          Services.storeUser(username, password, email, realname, success);
        }
      });
  }

  storeUser(username, password, email, realname, success) {
    const user = {
      userId: username,
      password: password,
      email: email,
      realname: realname
    }
    firebase.database().ref('/users/'+username).set(user, ()=> {
      success(user);
    });
  }

  static fetchUser(userId, success, fail) {
    const database = firebase.database();
    let user = null;
    database.ref('users/'+userId).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(userId);
      }

    });
  }

  static fetchGroup(groupname, success, fail) {
    const database = firebase.database();
    database.ref('groups/'+groupname).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(groupname);
      }

    });
  }

  static fetchDefaultSelfie(name, success, fail) {
    const database = firebase.database();
    database.ref(name).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(name);
      }
    });
  }

  static joinGame(userId, gameId) {
    firebase.database().ref('games/'+gameId+'/players/'+userId).set('JOINED');
    firebase.database().ref('users/'+userId+'/gameinvites/'+gameId).remove();
  }

  static fetchGame(gameId, success, fail) {
    const database = firebase.database();
    database.ref('games/'+gameId).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(gameId);
      }
    });
  }

  static createGame(game) {
    firebase.database().ref('games/' + game.gameId).set(game);
  }

  static createUser(user) {
    firebase.database().ref('groups/' + user.userId).set(user);
  }

  static subscribeToGame(gameId, onchange) {
    const ref = firebase.database().ref('games/' + gameId);
    ref.off();
    ref.on('value', function(snapshot) {
      onchange(snapshot.val());
    });
  }

  static inviteUserToGame(userId, gameId) {
    firebase.database().ref('users/'+userId+'/gameinvites/'+gameId).set('INVITED');
  }

  static createUser(user) {
    firebase.database().ref('users/'+user.userId).set(user);
  }

  static createActiveGame(game) {
    const now = new Date();
    const ms = now.getMilliseconds();
    const g = {gameCode: game.gameCode, gameId: game.gameId, time: ms}
    firebase.database().ref('activegames/'+game.gameCode).set(g);
  }

  static subsribe(url, onchange) {
    const ref = firebase.database().ref(url);
    ref.on('value', function(snapshot) {
      onchange(snapshot.val());
    });
  }

  static getActiveGame(gameCode, success, fail) {
    const database = firebase.database();
    database.ref('activegames/'+gameCode).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(gameCode);
      }
    });
  }

  static getGameFromActiveGameCode(gameCode, success, fail) {
    Services.getActiveGame(gameCode,
      (a)=> {
        Services.fetchGame(a.gameId,
          (game)=>{
            success(game);
          },
          (f)=> {
            fail(f)
          }
        );
      },
      (f) => {
        fail(f);
      });
  }

  static removeActiveGame(gameCode) {
    firebase.database().ref('activegames/'+gameCode).remove();
  }

  static requestFriendship(userId, friendId) {
    firebase.database().ref('userFriends/'+friendId+'/'+userId).set('PENDING');
  }

  static acceptFriendship(userId, friendId) {
    firebase.database().ref('userFriends/'+userId+'/'+friendId).set('ACCEPTED');
    firebase.database().ref('userFriends/'+friendId+'/'+userId).set('ACCEPTED');
  }

  static denyFriendship(userId, friendId) {
    firebase.database().ref('userFriends/'+userId+'/'+friendId).remove();
  }

  static getActiveUser(userId, success, fail) {
    const database = firebase.database();
    database.ref('activeusers/'+userId).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(userId);
      }
    });
  }

  static getUserFriends(userId, success, fail) {
    const database = firebase.database();
    database.ref('userFriends/'+userId).once('value').then((snapshot) => {
      if (snapshot.val()) {
        success(snapshot.val());
      } else {
        fail(userId);
      }
    });
  }

  static subscribeToUser(userId, onchange) {
    Services.subsribe('users/' + userId, onchange);
  }

  static subscribeToGroupInvites(userId, onchange) {
    Services.subsribe('users/' + userId+'/groupinvites', onchange);
  }

  static subscribeToGameInvites(userId, onchange) {
    Services.subsribe('users/' + userId+'/gameinvites', onchange);
  }

  static changeGameState(gameId, status) {
    firebase.database().ref('/games/'+gameId+'/state').set(status);
  }

  static startGame(gameId) {
    Services.changeGameState(gameId, 'STARTED');
  }

  static runGame(gameId) {
    Services.changeGameState(gameId, 'RUNNING');
  }

  static endGame(gameId) {
    Services.changeGameState(gameId, 'ENDED');
    Services.removeActiveGame(gameId);
  }

  static voteGame(gameId) {
    Services.changeGameState(gameId, 'VOTING');
  }

  static electWinnerGame(gameId) {
    Services.changeGameState(gameId, 'ELECTING_WINNER');
  }

  static addSelfie(gameId, userId, selfie) {
    firebase.database().ref('/games/'+gameId+'/selfies/'+userId).set(selfie);
  }

  static voteSelfie(gameId, userId, upvote, downvote) {
    firebase.database().ref('/games/'+gameId+'/selfies/'+userId).once('value').then((snapshot) => {
      if (snapshot.val()) {
        const selfie = snapshot.val();
        const u = selfie.upvotes + upvote;
        const d = selfie.downvotes + downvote;
        firebase.database().ref('/games/'+gameId+'/selfies/'+userId+'/upvotes').set(u);
        firebase.database().ref('/games/'+gameId+'/selfies/'+userId+'/downvotes').set(d);
      }
    });
  }

  static inviteUsersToGame(userId, gameId) {
    Services.fetchGame(gameId,
      (game)=>{
        Object.keys(game.group.members).forEach((member)=>{
          if (member!==userId) {
            Services.inviteUserToGame(member, gameId);
          }
        });
      },
      (fail)=>{
        console.log('failed invite',fail);
      });
  }
}
