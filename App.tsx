import React, { useState, useEffect, useMemo, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View, LogBox
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStackNavigator from "./app/src/navigation/stacks/AuthStackNavigator";
import SignedInStackNavigator from './app/src/navigation/stacks/SignedInStackNavigator';
import { AuthContext } from './app/src/context/authContext';
import * as config from './app/src/configs'

LogBox.ignoreLogs(['new NativeEventEmitter']); 
LogBox.ignoreAllLogs();

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {

  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, setSpinner] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setSpinner(!spinner);
    }, 3000);
  }, []);

  const authContext = useMemo(() => ({

     signIn:  () => {
         setIsLoggedIn(true);
     }

  }), []);

  return (
    <AuthContext.Provider value={authContext}>
    <PaperProvider>
      <NavigationContainer>
         { isLoggedIn ? <SignedInStackNavigator/> : <AuthStackNavigator/> }
      </NavigationContainer>
    </PaperProvider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
