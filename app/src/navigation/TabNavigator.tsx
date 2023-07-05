import React from 'react';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { MultiBarProvider, BottomTabBarWrapper } from 'react-native-multibar';
import * as configs from '../configs';
import HomeScreen from '../screens/HomeScreen';
import MoreItemsScreen from '../screens/MoreItemsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderLeftComponent } from '../components/HeaderLeftComponent';
import ProfileScreen from '../screens/ProfileScreen';


const TabNavigator: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const navigateBack = () => { navigation.goBack() }
  const Tab = React.useRef<ReturnType<typeof createBottomTabNavigator>>(createBottomTabNavigator()).current;

  return (
    <MultiBarProvider
      overlayProps={{
        expandingMode: 'staging',
      }}
      data={[]}
      initialExtrasVisible={false}>
      <Tab.Navigator
        tabBar={props => (
          <BottomTabBarWrapper params={props.navigation}>
            <BottomTabBar {...props} />
          </BottomTabBarWrapper>
        )}
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: configs.colors.primary,
          tabBarInactiveTintColor: configs.colors.dark,
          tabBarStyle: {
            backgroundColor: configs.colors.white,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            textAlign: 'center',
          },
          tabBarLabelPosition: 'below-icon',
        }}>

        <Tab.Screen
          name="HomeTabScreen"
          component={HomeScreen}
          options={HeaderLeftComponent({ headerShown: false, headerTitle: 'Home', tabBarLabel: 'Home', tabIcon: 'home', onPressBackButton: navigateBack })}
        />

        <Tab.Screen
          name="ProfileTabScreen"
          component={ProfileScreen}
          options={HeaderLeftComponent({ headerShown: false, headerTitle: 'My Profile', tabBarLabel: 'My Profile', tabIcon: 'user-circle', onPressBackButton: navigateBack })}
        />


        <Tab.Screen
          name="HelpTabScreen"
          component={ContactUsScreen}
          options={HeaderLeftComponent({ headerShown: true, headerTitle: 'Help', tabBarLabel: 'Help', tabIcon: 'question-circle', onPressBackButton: navigateBack })}
        />

        <Tab.Screen
          name="MoreTabScreen"
          component={MoreItemsScreen}
          options={HeaderLeftComponent({ headerShown: true, headerTitle: 'Preferences', tabBarLabel: 'More', tabIcon: 'bars', onPressBackButton: navigateBack })}
        />

      </Tab.Navigator>
    </MultiBarProvider>
  );
};
export default TabNavigator;
