import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
const Stack = createNativeStackNavigator();
import * as colors from '../../configs/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import Icon from 'react-native-vector-icons/FontAwesome5';


const HomeStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
             title: 'Welcome',
             headerStyle: {
                backgroundColor: colors.default.primary
             },
             headerTintColor: colors.default.white
             }}
        />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      </Stack.Navigator>
  );
};

export default HomeStack;