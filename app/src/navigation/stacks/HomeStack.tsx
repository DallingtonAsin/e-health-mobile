import React, { useEffect, useContext, useState } from 'react';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { MultiBarProvider, BottomTabBarWrapper } from 'react-native-multibar';
import * as configs from '../../configs';
import HomeScreen from '../../screens/HomeScreen';
import MoreItemsScreen from '../../screens/MoreItemsScreen';
import ContactUsScreen from '../../screens/ContactUsScreen';
import SpecialityCategoryScreen from '../../screens/MedicalSpecialtyScreen';
import { useNavigation } from '@react-navigation/native';
import { HeaderLeftComponent } from '../../components/HeaderLeftComponent';
import { addNotification, selectNotifications } from "../../redux/reducers/notificationSlice";
import { Notification } from "../../interfaces";
import { displayMessage } from "../../components/common/SharedHelper";
import { useDispatch, useSelector } from 'react-redux';
import { Context as AppContext } from '../../context/appContext';
import AppLoader from "../../components/AppLoader";
const Tab = createBottomTabNavigator();


const HomeStack = () => {

  const navigation = useNavigation();

  const navigateBack = () => { navigation.goBack() }

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const notifications = useSelector(selectNotifications)
  const { state, getNotifications } = useContext(AppContext);

  const fetchNotifications = () => {
    getNotifications({ is_patient: state.user.is_patient, onSuccess: populateNotifications, onFailure: displayMessage, onCompletion: stopLoading });
  }

  const populateNotifications = (data: any) => {
    try {
      let messages = data.notifications;
      if (messages.length > 0) {
        messages.forEach((notification: Notification) => {
          const existingNotification = notifications.find((n: Notification) => n.id === notification.id);
          if (!existingNotification) {
            dispatch(addNotification(notification));
          }
        });
      }
    } catch (error: any) {
      console.log('error', error.message)
    }
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, []);

  if (isLoading) {
    return (
      <AppLoader bgColor={configs.colors.white} />
    )
  }

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
          options={HeaderLeftComponent({ headerShown: false, headerTitle: 'Home', tabIcon: 'home', onPressBackButton: navigateBack })}
        />

        <Tab.Screen
          name="DoctorsTabScreen"
          component={SpecialityCategoryScreen}
          options={HeaderLeftComponent({ headerShown: true, headerTitle: 'Specialties', tabIcon: 'user-md', onPressBackButton: navigateBack })}
        />


        <Tab.Screen
          name="HelpTabScreen"
          component={ContactUsScreen}
          options={HeaderLeftComponent({ headerShown: true, headerTitle: 'Help', tabIcon: 'question-circle', onPressBackButton: navigateBack })}
        />

        <Tab.Screen
          name="MoreTabScreen"
          component={MoreItemsScreen}
          options={HeaderLeftComponent({ headerShown: false, headerTitle: 'More', tabIcon: 'bars', onPressBackButton: navigateBack })}
        />


      </Tab.Navigator>
    </MultiBarProvider>
  );
};
export default HomeStack;
