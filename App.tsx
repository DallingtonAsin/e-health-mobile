import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as AppProvider } from './app/src/context/appContext';
import { Provider as PatientProvider } from './app/src/context/patientContext';
import { Provider as DoctorProvider } from './app/src/context/doctorContext';
import { Provider as AuthProvider } from './app/src/context/authContext';
import { Context as AppContext } from './app/src/context/appContext';
import { Context as AuthContext } from './app/src/context/authContext';

import AppLoader from './app/src/components/AppLoader';
import * as config from './app/src/configs';
import store from './app/src/redux/store';
import { Provider } from 'react-redux';
import { appReducer } from './app/src/context/reducers/appReducer';
import { getData } from './app/src/async-storage';
import AuthStack from './app/src/navigation/AuthStack';
import AppStackScreen from './app/src/navigation/AppStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();


const App: React.FC = () => {

  // const [state, dispatch] = React.useReducer(appReducer, {})
  const { state } = React.useContext(AuthContext);
  console.log(`auth token`, state);

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
      <Stack.Navigator initialRouteName="AuthStack">

        {state.token != null ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignedInStack" component={AppStackScreen} />
          </Stack.Group>
        )
          : (
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="AuthStack" component={AuthStack} />
            </Stack.Group>

          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AuthProvider>
      <PatientProvider>
        <DoctorProvider>
          <AppProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </AppProvider>
        </DoctorProvider>
      </PatientProvider>
    </AuthProvider>
  );
};