import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as AppProvider } from 'react-native-paper';
import AuthFlow from "./app/src/navigation/stacks/AuthStackNavigator";
import SignedInStackNavigator from './app/src/navigation/stacks/SignedInStackNavigator';
import { Provider as AuthProvider } from './app/src/context/authContext';
import { Context as AuthContext } from './app/src/context/authContext';
import AppLoader from './app/src/components/AppLoader';
import * as config from './app/src/configs';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();


function App() {

  const { state } = React.useContext(AuthContext);
  console.log(`current app state is`, state.isAppLoading);
  if (state.isAppLoading) {
    return (
      <AppLoader bgColor={config.colors.white} />
    )
  }

  return (
    <NavigationContainer>
      {!state.token
        ? <AuthFlow />
        : <SignedInStackNavigator />
      }
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  );
};