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
import SpecialityCategoryScreen from '../../screens/MedicalSpecialtyScreen';
import CustomStackHeader from '../../components/CustomStackHeader';

const Tab = createBottomTabNavigator();
const tabIconFontSize = 22;

const HomeStack = () => {

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

        <Tab.Screen
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


        <Tab.Screen
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

        <Tab.Screen
          name="MoreTabScreen"
          component={MoreItemsScreen}
          options={({ route }: { route: any}) => ({
             tabBarLabel: 'More',
             tabBarIcon: ({color, size}) => (
              <Icon5
                name="bars"
                style={{
                  fontSize: tabIconFontSize,
                  color: color,
                }}
              />
            ),
            headerShown: false,
            title: 'More',
            tabBarLabelStyle: {
               fontSize: configs.fonts.normal
            }
             })}
        />


      </Tab.Navigator>
    </MultiBarProvider>
  );
};
export default HomeStack;
