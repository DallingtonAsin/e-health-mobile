import React from 'react';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from './HomeStack';
import {useTheme} from 'react-native-paper';
import * as customColors from '../../configs/colors'
import HomeScreen from '../../screens/HomeScreen';

const BottomTab = createBottomTabNavigator();
const tabIconFontSize = 18;

const BottomTabStack = () => {
  const {colors} = useTheme();

  return (
    <MultiBarProvider
      overlayProps={{
        expandingMode: 'staging',
      }}
      data={[
        ({params}) => (
          <Icon
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
          <Icon name="flag" color="#E24E1B" size={12} onPress={() => {}} />
        ),
        ({params}) => (
          <Icon
            name="headphones"
            color="#E24E1B"
            size={12}
            onPress={() => {}}
          />
        ),
        ({params}) => (
          <Icon name="heart" color="#E24E1B" size={14} onPress={() => {}} />
        ),
      ]}
      initialExtrasVisible={false}>
      <BottomTab.Navigator
        tabBar={props => (
          <BottomTabBarWrapper params={props.navigation}>
            <BottomTabBar {...props} />
          </BottomTabBarWrapper>
        )}
        tabBarOptions={{
          activeTintColor: customColors.default.primary,
          inactiveTintColor: customColors.default.dark,
          style: {
            backgroundColor: customColors.default.white,
          },
          labelStyle: {
            fontSize: 14,
            textAlign: 'center',
          },
          labelPosition: 'below-icon',
        }}>
        <BottomTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="home"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
          }}
        />

        <BottomTab.Screen
          name="Notifications"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="bell"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
          }}
        />


        <BottomTab.Screen
          name="Help"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="question-circle"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
          }}
        />

        <BottomTab.Screen
          name="Profile"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="user-circle"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
          }}
        />
      </BottomTab.Navigator>
    </MultiBarProvider>
  );
};
export default BottomTabStack;
