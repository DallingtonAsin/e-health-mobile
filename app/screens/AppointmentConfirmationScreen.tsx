import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import * as configs from '../configs';
import { Avatar } from 'react-native-paper';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

const AppointmentConfirmationScreen = ({ route, navigation }) => {

  const { src, name, title } = route.params

  const navigateToHome = () => {
      navigation.navigate(`Home`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >

        <View style={styles.body}>
          <Icon5 name="check-circle" size={90} color={configs.colors.white} />
          <Text style={styles.bookedTitle}>Appointment booked!</Text>
          <Text style={styles.info}>You have an appointment with</Text>
          <View style={styles.details}>
            <Avatar.Image size={60} source={src} />
            <View style={styles.personalInfo}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.infoTitle}>{title}</Text>
            </View>
          </View>
        </View>

          <Text style={styles.date}> <Icon5 name="calendar-alt" size={15} color={configs.colors.white} /> on Mon, 21 December - 10:00 am</Text>
      
        <Pressable style={styles.button} onPress={() => navigateToHome()}>
          <Text style={styles.okayText}>Okay</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

export default AppointmentConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.primary
  },

  scroll: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  body: {
    top: -50,
    alignItems: 'center',

  },

  bookedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: configs.colors.white,
    marginVertical: 15,
  },

  info: {
    color: configs.colors.white,
    opacity: 0.8,
    marginVertical: 10,
  },

  details: {
    flexDirection: 'row',
    backgroundColor: configs.colors.white,
    paddingHorizontal: 35,
    paddingVertical: 10,
    width: '90%',
    borderRadius: 5,
    marginVertical: 20
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



  date: {
    color: configs.colors.white,
    fontSize: 16,
    opacity: 0.7
  },

  button: {
    backgroundColor: configs.colors.white,
    paddingHorizontal: 148,
    paddingVertical: 18,
    borderRadius: 5,
    bottom: 50,
    position: 'absolute',
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  okayText: {
    fontSize: 15,
    color: configs.colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  dateSection: {
    flexDirection: 'row',
  }

});


