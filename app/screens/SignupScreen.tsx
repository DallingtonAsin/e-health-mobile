import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as configs from '../configs'
import { TextInput, Menu, Button, Divider } from 'react-native-paper';


interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    gender: string,
    language: string,
    address: string,
    phoneNumber: string,
}
const numberOfLines = 2;

const SignupScreen = ({navigation}) => {

    const [user, setUser] = useState<IUser>();
    const [isSection1Filled, setSection1Filled] = useState(false);

    const completeRegistration = () => {
        setSection1Filled(true);
    }

    const submitDetails = () => {
        navigation.navigate('Home');
    }

     const Section1 = () => {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Register for Medical Services</Text>
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>First Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="First Name"
                            value={user?.firstName}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={configs.colors.primary}
                            numberOfLines={numberOfLines}
                        />
                    </View>
    
    
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Last Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Last Name"
                            value={user?.lastName}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>
    
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Email address</Text>
                        <TextInput
                            label="Email address"
                            value={user?.email}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>
    
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Date of Bith<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Date of Birth"
                            value={user?.dob}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>
    
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Gender"
                            value={user?.gender}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>
    
                
    
                    <View style={styles.viewContainer}>
                        <TouchableOpacity style={configs.styles.secondaryBtn}
                        onPress={() => completeRegistration()}>
                            <Text style={configs.styles.btnText}>Next</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={styles.viewContainer}>
                        <TouchableOpacity style={styles.back2Login} onPress={() => navigation.navigate('Signin')}>
                            <Text style={styles.back2LoginTxt}>Back to login</Text>
                        </TouchableOpacity>
                    </View>
    
                </ScrollView>
            </SafeAreaView>
        )
     }

     const Section2 = () => {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Complete Registration</Text>
                
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Language<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Language"
                            value={user?.language}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Location<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Location"
                            value={user?.address}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>

                    <View style={[styles.viewContainer, configs.styles.bottomizedBtn]}>
                        <TouchableOpacity style={[configs.styles.secondaryBtn]}
                         onPress={() => submitDetails()}>
                            <Text style={configs.styles.btnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
    
                </ScrollView>
            </SafeAreaView>
        )
     }

        return (
           !isSection1Filled ?  <Section1/> : <Section2/>
        )
     }



export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        margin: 15,
    },

    labelTxt: {
        fontSize: 18,
    },

    viewContainer: {
        marginVertical: 10,
    },

    title: {
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 24,
        color: configs.colors.dark,
        fontFamily: 'Times New Roman',
        paddingLeft: 30,
        paddingRight: 30,
    },

    back2Login: {
        alignItems: 'center',
        paddingBottom:20,
    },

    back2LoginTxt: {
        color: configs.colors.primary,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    required: {
        color: configs.colors.danger,
    }
})