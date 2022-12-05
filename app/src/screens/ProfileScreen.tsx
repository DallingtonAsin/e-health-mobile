import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import * as config from '../configs'

const ProfileScreen = () => {

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.profileTxt}>Patient profile will load here...</Text>
    </SafeAreaView>
  )

}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.primary,
        justifyContent: 'center',
        alignItems:'center'
    },

    profileTxt: {
        color: config.colors.white,
        fontSize:20,
    }
})