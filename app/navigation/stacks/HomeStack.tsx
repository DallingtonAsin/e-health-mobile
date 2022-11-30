import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import SpecialitiesScreen from '../../screens/SpecialityCategoryScreen'
const Stack = createNativeStackNavigator();
import * as colors from '../../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COMPANY_NAME } from '@env'

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"Home"}
                component={HomeScreen}
                options={{
                    headerStyle: {
                        backgroundColor: colors.default.primary,
                    },
                    headerTintColor: colors.default.primary,
                    headerTitle: COMPANY_NAME,
                    headerBackVisible: true,
                    headerShown: false,
                    
                    headerLeft: () => (
                        <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                            <Icon name="bars" size={28} color={colors.default.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name="Specialities" component={SpecialitiesScreen} />
        </Stack.Navigator>
    );
};

export default HomeStack;