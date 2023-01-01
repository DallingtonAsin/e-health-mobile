import React, { useState, useContext, useEffect, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View, LogBox
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as AppProvider } from 'react-native-paper';
import AuthFlow from "./app/src/navigation/stacks/AuthStackNavigator";
import SignedInStackNavigator from './app/src/navigation/stacks/SignedInStackNavigator';
import { Provider as AuthProvider } from './app/src/context/authContext';
import { Context as AuthContext } from './app/src/context/authContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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

const Stack = createNativeStackNavigator();

function App() {
  const {state} = React.useContext(AuthContext);
 
  return (
    <NavigationContainer>
        {!state.token
         ? <AuthFlow/>
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
