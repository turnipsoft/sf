import React from 'react';
import { Scene, Stack, Router, Reducer } from 'react-native-router-flux';
import LoginView from './views/loginview';
import HomeView from './views/homeview';
import StartGameView from './views/startgameview';
import ConfirmGameView from './views/confirmgameview';
import PreparingGameView from './views/preparinggameview';
import RunGameView from './views/rungameview';
import VoteView from './views/voteview';
import WinnerView from './views/winnerview';
import JoinView from './views/joinview';
import LobbyView from './views/lobbyview';
import CreateGameView from './views/creategameview';

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('ACTION:', action);
    return defaultReducer(state, action);
  };
};

const RouterComponent = () => {
  return (
    <Router createReducer={reducerCreate}>
      <Stack key="root">
        <Scene key="home" component={HomeView} title="Selfighter" hideNavBar/>
        <Scene key="creategame" component={CreateGameView} title="Create a new Selfight" hideNavBar />
        <Scene key="startgame" component={StartGameView} title="Start a Selfight" hideNavBar />
        <Scene key="confirmgame" component={ConfirmGameView} title="About to get serious" hideNavBar />
        <Scene key="preparinggame" component={PreparingGameView} title="Selfight is firing up!" hideNavBar />
        <Scene key="login" component={LoginView} title="Please Login" initial hideNavBar />
        <Scene key="rungame" component={RunGameView} title="Selfight" hideNavBar />
        <Scene key="vote" component={VoteView} title="Voting" hideNavBar />
        <Scene key="winner" component={WinnerView} title="Winner!!!" hideNavBar />
        <Scene key="join" component={JoinView} title="Join Game" hideNavBar />
        <Scene key="lobby" component={LobbyView} title="Lobby" hideNavBar />
      </Stack>
    </Router>
  );
};

export default RouterComponent;
