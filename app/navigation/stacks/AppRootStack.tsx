import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../../screens/HomeScreen";
const Stack = createNativeStackNavigator();

const AppRootStack = () => {
 return(
     <Stack.Navigator>
        <Stack.Screen 
        name= "Home"
        component={HomeScreen}
        options={{title: 'Home'}}
        />
     </Stack.Navigator>
 )
}

export default AppRootStack;