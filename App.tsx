/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View, LogBox
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as config from './app/src/configs'
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStackNavigator from "./app/src/navigation/stacks/AuthStackNavigator";
import SignedInStackNavigator from './app/src/navigation/stacks/SignedInStackNavigator';


LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

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

  return (
    <PaperProvider>
      <NavigationContainer>
         { isLoggedIn ? <SignedInStackNavigator/> : <AuthStackNavigator/> }
      </NavigationContainer>
    </PaperProvider>
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
