import React from 'react';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import * as configs from '../../configs'
import HomeScreen from '../../screens/HomeScreen';
import MoreItemsScreen from '../../screens/MoreItemsScreen';
import ContactUsScreen from '../../screens/ContactUsScreen';
import Icon5 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import MeetingRoomScreen from '../../screens/MeetingRoomScreen';
import SplashScreen from '../../screens/SplashScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import {useTheme} from 'react-native-paper';
import SpecialityCategoryScreen from '../../screens/MedicalSpecialtyScreen';

const BottomTab = createBottomTabNavigator();
const tabIconFontSize = 22;

const HomeStack = () => {

  return (
    <MultiBarProvider
      overlayProps={{
        expandingMode: 'staging',
      }}
      data={[]}
      initialExtrasVisible={false}>
      <BottomTab.Navigator
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
        <BottomTab.Screen
          name="HomeTabScreen"
        
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon5
                name="home"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
            title: 'Home',
            tabBarLabelStyle: {
              fontSize: configs.fonts.normal
           }
          }}
        />

        <BottomTab.Screen
          name="DoctorsTabScreen"
          component={SpecialityCategoryScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon5
                name="user-md"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
            title: 'Doctors',
            tabBarLabelStyle: {
              fontSize: configs.fonts.normal
           }
          }}
        />


        <BottomTab.Screen
          name="HelpTabScreen"
          component={ContactUsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon5
                name="question-circle"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
            title: 'Help',
            tabBarLabelStyle: {
              fontSize: configs.fonts.normal
           }
          }}
        />

        <BottomTab.Screen
          name="MoreTabScreen"
          component={MoreItemsScreen}
          
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon5
                name="bars"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: true,
            title: 'Preferences',
            tabBarLabelStyle: {
               fontSize: configs.fonts.normal
            }
          
          }}
        />


      </BottomTab.Navigator>
    </MultiBarProvider>
  );
};
export default HomeStack;
