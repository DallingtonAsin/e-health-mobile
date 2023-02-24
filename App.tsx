import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as AppProvider } from 'react-native-paper';
import AuthFlow from "./app/src/navigation/stacks/AuthStackNavigator";
import SignedInStackNavigator from './app/src/navigation/stacks/SignedInStackNavigator';
import { Provider as AuthProvider } from './app/src/context/appContext';
import { Context as AppContext } from './app/src/context/appContext';
import AppLoader from './app/src/components/AppLoader';
import * as config from './app/src/configs';
import store from './app/src/redux/PharmacyStore';
import { Provider } from 'react-redux';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();


function App() {

  const { state } = React.useContext(AppContext);

  if (state.isAppLoading) {
    return (
      <AppLoader bgColor={config.colors.white} />
    )
  }

  return (
    <NavigationContainer>
      { !state.token && <AuthFlow/> }
      { state.token &&
         <Provider store={store}>
            <SignedInStackNavigator/>
         </Provider>
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