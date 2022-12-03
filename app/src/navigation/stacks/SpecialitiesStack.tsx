import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SpecialitiesScreen from '../../screens/SpecialityCategoryScreen';
const Stack = createNativeStackNavigator();
import * as configs from '../../configs'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';


const SpecialitiesStack = ({ }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"Specialities"}
                component={SpecialitiesScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.primary,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Vastel`,
                    headerBackVisible: true,
                    headerShown: false,
                    
                    headerLeft: () => (
                        <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                            <Icon name="bars" size={28} color={configs.colors.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
};

export default SpecialitiesStack;