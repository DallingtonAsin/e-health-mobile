import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from "./app/src/navigation/stacks/AuthStack";
import AppStack from './app/src/navigation/stacks/AppStack';
import { Provider as AppProvider } from './app/src/context/appContext';
import { Provider as PatientProvider } from './app/src/context/patientContext';
import { Provider as DoctorProvider } from './app/src/context/doctorContext';
import { Provider as AuthProvider } from './app/src/context/authContext';
import { Context as AppContext } from './app/src/context/appContext';
import AppLoader from './app/src/components/AppLoader';
import * as config from './app/src/configs';
import store from './app/src/redux/store';
import { Provider } from 'react-redux';
import { appReducer } from './app/src/context/reducers/appReducer';
import { getData } from './app/src/async-storage';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();


const App: React.FC = () => {

  // const [state, dispatch] = React.useReducer(appReducer, {})
  const { state } = React.useContext(AppContext);
  // console.log(`auth token`, state.token);

  // React.useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     let userToken;
  //     try {
  //      let data = await getData();
  //      userToken = data.token;
  //       console.log(`Auth token`, userToken)
  //     } catch (e) {
  //       // Restoring token failed
  //     }
  //     dispatch({ type: 'RESTORE_TOKEN', access_token: userToken });
  //   };
  //   bootstrapAsync();
  // }, []);

  // if (state.isAppLoading) {
  //   return (
  //     <AppLoader bgColor={config.colors.white} />
  //   )
  // }

  return (
    <NavigationContainer>
      {state.token ? (
        <Provider store={store}>
          <AppStack />
        </Provider>
      )
        : (
          <AuthProvider>
            <AuthStack />
          </AuthProvider>
        )
      }
    </NavigationContainer>
  );
}

export default () => {
  return (
    <PatientProvider>
      <DoctorProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </DoctorProvider>
    </PatientProvider>
  );
};