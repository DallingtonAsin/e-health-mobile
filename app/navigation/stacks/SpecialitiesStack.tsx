import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SpecialitiesScreen from '../../screens/SpecialityCategoryScreen';
const Stack = createNativeStackNavigator();
import * as colors from '../../configs/colors';
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
                        backgroundColor: colors.default.primary,
                    },
                    headerTintColor: colors.default.primary,
                    headerTitle: `Vastel`,
                    headerBackVisible: true,
                    headerShown: false,
                    
                    headerLeft: () => (
                        <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                            <Icon name="bars" size={28} color={colors.default.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
};

export default SpecialitiesStack;