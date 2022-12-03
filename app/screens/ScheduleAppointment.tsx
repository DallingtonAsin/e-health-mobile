import React from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet, View, Text, Pressable, useWindowDimensions
} from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

// #673ab7, '#ff4081'

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: configs.colors.white  }}>
        <Text>Appointment info will go here...</Text>
    </View>
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: configs.colors.white }}>
        <Text>Doctor's information will go here...</Text>
    </View>
);

const ScheduleAppointmentScreen = ({ route, navigation } : {route: any, navigation: any}) => {

    let item = route.params;
    const { src, name, title } = item;

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'appointment', title: 'Appointment' },
        { key: 'about', title: 'About' },
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: configs.colors.primary }}
          style={{ backgroundColor: configs.colors.white }}
          renderLabel={({ route, focused, color }) => (
            <Text style={{ color: '#000', margin: 8, fontSize:17, fontWeight: '400', opacity:0.8 }}>
              {route.title}
            </Text>
          )}
        />
      );

    const renderScene = SceneMap({
        appointment: FirstRoute,
        about: SecondRoute,
    });

    const confirmAppointment = () => {
        navigation.navigate(`AppointmentConfirmation`, item);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Avatar.Image size={60} source={src} />
                    <View style={styles.personalInfo}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.infoTitle}>{title}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>



                <View style={styles.footer}>
                    <Pressable style={styles.button} onPress={() => confirmAppointment()}>
                        <Text style={styles.okayText}>confirm appointment</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    )

}

export default ScheduleAppointmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: configs.colors.white,

    },

    header: {
        // flex:1,
        flexDirection: 'row',
        backgroundColor: configs.colors.white,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 5,
        // marginVertical: 5,
        // marginHorizontal: 15,
    },

    body: {
        flex: 1,
        marginHorizontal: 5
    },

    footer: {
        // flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },


    name: {
        color: configs.colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    personalInfo: {
        paddingHorizontal: 10,
        top: 5
    },

    infoTitle: {
        color: configs.colors.black,
        fontSize: 16,
        opacity: 0.6
    },


    button: {
        backgroundColor: configs.colors.primary,
        bottom: 50,
        position: 'absolute',
        paddingHorizontal: 80,
        paddingVertical: 18,
        borderRadius: 5,
    },


    okayText: {
        fontSize: 18,
        color: configs.colors.white,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },


})