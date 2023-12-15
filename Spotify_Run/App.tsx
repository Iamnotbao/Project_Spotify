import React from 'react';
import { View } from 'react-native';
import HomeScreen from './src/HomeScreen';
import App_Run from './src/App';
import Login from './src/Login';
import { NavigationContainer } from '@react-navigation/native';
import { SongContext } from './src/SongContext';
import { ModalPortal } from 'react-native-modals';


const App = () => {
  return (
    <>
      <SongContext>
        <App_Run />
        <ModalPortal/>
      </SongContext>
    </>

  )
}
export default App;