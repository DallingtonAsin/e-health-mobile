import React from "react"
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../../screens/HomeScreen";
import SpecialityCategoryScreen from '../../screens/SpecialityCategoryScreen';
import SpecialityListScreen from "../../screens/SpecialityListScreen";
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
              headerTintColor: colors.default.primary,
              headerTitle: ``,
              headerBackVisible: true,
              headerShown: true,
              
              headerLeft: () => (
                  <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 0 }}>
                      <Icon name="bars" size={35} color={colors.default.primary} />
                  </TouchableOpacity>
              ),
            }}
        />
         <Stack.Screen name="SpecialityCategories" component={SpecialityCategoryScreen} />
         <Stack.Screen 
         name="SpecialitiesList"
         options={{
            headerStyle: {
                backgroundColor: colors.default.white,
            },
            headerTintColor: colors.default.primary,
            headerTitle: `List of specialists`,
            headerBackVisible: true,
            headerShown: true,
          }}
          component={SpecialityListScreen} />

     </Stack.Navigator>
 )
}

export default AppRootStack;