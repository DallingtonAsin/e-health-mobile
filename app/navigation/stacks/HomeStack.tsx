import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
const Stack = createNativeStackNavigator();
import * as colors from '../../configs/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';


const HomeStack = ({ }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"Home"}
                component={HomeScreen}
                options={{
                    headerStyle: {
                        backgroundColor: colors.default.pink,
                    },
                    headerTintColor: colors.default.pink,
                    headerTitle: `Vastel`,
                    headerBackVisible: true,
                    headerShown: false,
                    
                    headerLeft: () => (
                        <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                            <Icon name="bars" size={28} color={colors.default.pink} />
                        </TouchableOpacity>
                    ),
                }}
            />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
};

export default HomeStack;