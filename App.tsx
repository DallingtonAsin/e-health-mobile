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
import { Notifications } from 'react-native-notifications'
import { PushNotification } from './app/src/interfaces'
import { getToken } from './app/src/components/common/AppUtils'
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

    // const getFcmToken = async () => {
    //   const token = await getToken()
    //   console.log(`Token:  ${token}`)
    // }

    // getFcmToken()
    Notifications.registerRemoteNotifications()

    const onRemoteNotificationReceived = Notifications.events().registerRemoteNotificationsRegistered((notification) => {
      // Process the received push notification here
      console.log('Received push notification:', notification)
    })

    Notifications.events().registerNotificationReceivedForeground((notification: any, completion) => {
      console.log(`notification`, notification)
      if(notification && notification['gcm.notification.title'] && notification['gcm.notification.body']){
        console.log(`Notification received in foreground: ${notification['gcm.notification.title']} : ${notification['gcm.notification.body']}`)
      }
      completion({ alert: false, sound: false, badge: false })
    })

    Notifications.events().registerNotificationOpened((notification: PushNotification, completion) => {
      console.log(`Notification opened: ${notification.payload}`)
      completion()
    })

    // let someLocalNotification = Notifications.postLocalNotification({
    //   body: "How are you?",
    //   title: "Message",
    //   sound: "chime.aiff",
    //   category: "SOME_CATEGORY",
    //   userInfo: {},
    //   fireDate: new Date(),
    // })

    return () => {
      onRemoteNotificationReceived.remove(); // Unregister the event listener
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