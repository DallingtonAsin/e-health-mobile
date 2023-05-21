import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as AppProvider } from './app/src/context/appContext'
import { Provider as PatientProvider } from './app/src/context/patientContext'
import { Provider as DoctorProvider } from './app/src/context/doctorContext'
import { Provider as AuthProvider } from './app/src/context/authContext'
import { Context as AuthContext } from './app/src/context/authContext'
import AppLoader from './app/src/components/AppLoader'
import * as config from './app/src/configs'
import store from './app/src/redux/store'
import { Provider } from 'react-redux'
import AuthStack from './app/src/navigation/AuthStack'
import AppStackScreen from './app/src/navigation/AppStack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Notification, Notifications, Registered, RegistrationError } from 'react-native-notifications'
import { showLocalNotification } from './app/src/components/common/communications'
const Stack = createNativeStackNavigator()

LogBox.ignoreLogs(['new NativeEventEmitter'])
LogBox.ignoreAllLogs()


const App = () => {

  const { state } = React.useContext(AuthContext)
  if (state.isAppLoading) {
    return (
      <AppLoader bgColor={config.colors.white} />
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthStack">

        {state.token ? (
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
  )
}

export default () => {

  useEffect(() => {

    Notifications.registerRemoteNotifications()

    const onRemoteNotificationReceived = Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
      // console.log("Device Token Received", event.deviceToken);
    })

    Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
      console.error(event);
    });

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      showLocalNotification(notification.title, notification.body)
      completion({ alert: true, sound: true, badge: false })
    })

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      completion()
    })

    return () => {
      //  onRemoteNotificationReceived.remove(); // Unregister the event listener
    };

  }, [])

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
  )
}