import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';


const MedicalRecordScreen = () => {

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            >

            </ScrollView>
        </SafeAreaView>
    )
}

export default MedicalRecordScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContainer: {
        flex: 1,
    }
})
