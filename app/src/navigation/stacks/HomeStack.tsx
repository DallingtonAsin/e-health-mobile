import React from 'react';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from 'react-native-paper';
import * as configs from '../../configs'
import HomeScreen from '../../screens/HomeScreen';
import MoreItemsScreen from '../../screens/MoreItemsScreen';
import ContactUsScreen from '../../screens/ContactUsScreen';
import SpecialityListScreen from '../../screens/SpecialityListScreen';
import MeetingRoomScreen from '../../screens/MeetingRoomScreen';
import SplashScreen from '../../screens/SplashScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const BottomTab = createBottomTabNavigator();
const tabIconFontSize = 22;

const HomeStack = () => {
  const {colors} = useTheme();

  return (
    <MultiBarProvider
      overlayProps={{
        expandingMode: 'staging',
      }}
      data={[
        ({params}) => (
          <Icon5
            name="chevron-left"
            color="#E24E1B"
            size={12}
            onPress={() => {
              if (params.canGoBack()) {
                params.goBack();
              }
            }}
          />
        ),
        ({params}) => (
          <Icon5 name="flag" color="#E24E1B" size={12} onPress={() => {}} />
        ),
        ({params}) => (
          <Icon5
            name="headphones"
            color="#E24E1B"
            size={12}
            onPress={() => {}}
          />
        ),
        ({params}) => (
          <Icon5 name="heart" color="#E24E1B" size={14} onPress={() => {}} />
        ),
      ]}
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
          }}
        />

        <BottomTab.Screen
          name="DoctorsTabScreen"
          component={SpecialityListScreen}
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
                  fontSize: tabIconFontSize*1,
                  color: color,
                }}
              />
            ),
            headerShown: false,
            title: 'More',
          }}
        />


      </BottomTab.Navigator>
    </MultiBarProvider>
  );
};
export default HomeStack;
