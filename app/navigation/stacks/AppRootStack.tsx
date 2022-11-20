import React from "react"
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../../screens/HomeScreen";
import SpecialitiesScreen from '../../screens/SpecialitiesScreen';
import * as colors from '../../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Stack = createNativeStackNavigator();

const AppRootStack = () => {
 return(
     <Stack.Navigator>
        <Stack.Screen 
          name={"Home"}
          component={HomeScreen}
          options={{
              headerStyle: {
                  backgroundColor: colors.default.white,
              },
              headerTintColor: colors.default.pink,
              headerTitle: ``,
              headerBackVisible: true,
              headerShown: true,
              
              headerLeft: () => (
                  <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 0 }}>
                      <Icon name="bars" size={35} color={colors.default.pink} />
                  </TouchableOpacity>
              ),
            }}
        />
         <Stack.Screen name="Specialities" component={SpecialitiesScreen} />
     </Stack.Navigator>
 )
}

export default AppRootStack;