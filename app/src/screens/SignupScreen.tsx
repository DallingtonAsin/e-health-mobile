import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as configs from '../configs'
import { TextInput } from 'react-native-paper';
import AppLoader from '../components/AppLoader';
import Toast from 'react-native-simple-toast';
import { PaperSelect } from 'react-native-paper-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { IUser } from '../interfaces';


const numberOfLines = 5;

const SignupScreen = ({ navigation }: { navigation: any }) => {

    const InitialUser = {
        first_name: '',
        last_name:  '',
        email:  '',
        dob:  '',
        gender:  '',
        language:  '',
        address:  '',
        phoneNumber:  '',
    }

    const [user, setUser] = useState<IUser>(InitialUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const {state, signup} = useContext(AuthContext);

    const [gender, setGender] = useState({
        value: '',
        list: [
            { _id: '1', value: 'Male' },
            { _id: '2', value: 'Female' },
        ],
        selectedList: [],
        error: '',
    });


    const submitDetails = () => {

        if(!user.first_name){
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if(!user.last_name){
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if(!gender.value){
            Toast.show('Select your gender', Toast.LONG);
            return;
        }

        if(!user.address){
            Toast.show('Enter your address', Toast.LONG);
            return;
        }

        if(!user.dob){
            Toast.show('Enter your date of birth', Toast.LONG);
            return;
        }

        setIsLoading(true);

        let payload: IUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user?.email,
            gender: gender.value,
            address: user.address,
            dob: user.dob
        }
     
        signup(payload);
        setIsLoading(false);
       
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        let dob = formatDate(date);
        setUser({
            ...user,
            dob: dob
        });
    };


    return (
        <>
            <SafeAreaView style={styles.container}>

                <StatusBar
                    backgroundColor={configs.colors.primary}
                />

                <ScrollView
                 style={styles.scrollView} 
                contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Create a Vastel Medical Services Account</Text>

                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>First Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="First Name"
                            value={user.first_name}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={configs.colors.primary}
                            numberOfLines={numberOfLines}
                            error={!user.first_name}
                            style={styles.textInput}
                            textColor={configs.colors.dark}
                            onChangeText={text => setUser(prev => ({...prev, first_name: text}))}
                          
                     />
                    </View>


                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>Last Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Last Name"
                            value={user.last_name}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                            style={styles.textInput}
                            error={!user.last_name}
                            textColor={configs.colors.dark}
                            onChangeText={text => setUser({...user, last_name: text})}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Email address</Text>
                        <TextInput
                            label="Email address"
                            value={user.email}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                            style={styles.textInput}
                            textColor={configs.colors.dark}
                            onChangeText={text => setUser(prev => ({...prev, email: text}))}
                        />
                    </View>


                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Address<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Address"
                            value={user.address}
                            mode="outlined"
                            activeOutlineColor={configs.colors.primary}
                            style={styles.textInput}
                            error={!user.address}
                            textColor={configs.colors.dark}
                            onChangeText={text => setUser(prev => ({...prev, address: text}))}
                        />
                    </View>

                    <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                            <PaperSelect
                                label="Select Gender"
                                value={gender.value}
                                onSelection={(value: any) => {
                                    setGender({
                                        ...gender,
                                        value: value.text,
                                        selectedList: value.selectedList,
                                        error: '',
                                    });
                                }}
                                arrayList={[...gender.list]}
                                selectedArrayList={gender.selectedList}
                                errorText={gender.error}
                                multiEnable={false}
                                textInputMode="outlined"
                                searchStyle={{ iconColor: configs.colors.primary }}
                                checkboxColor={configs.colors.primary}
                                activeOutlineColor={configs.colors.primary}
                                hideSearchBox={true}
                                containerStyle={{ height: 10 }}
                                dialogButtonLabelStyle={{ color: configs.colors.primary }}
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Date of Bith<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Date of Birth"
                                value={user.dob}
                                mode="outlined"
                                activeOutlineColor={configs.colors.primary}
                                style={styles.textInput}
                                error={!user.dob}
                                textColor={configs.colors.dark}
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={text => setUser(prev => ({...prev, dob: text}))}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </View>
                    </View>

                    <View style={styles.viewContainer}>
                        <TouchableOpacity style={configs.styles.secondaryBtn}
                            onPress={() => submitDetails()}>
                            <Text style={[configs.styles.btnText]}>Continue</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )
}


export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    scrollView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        margin: 15,
    },

    inputWrap: {
        flex: 1,
        paddingHorizontal: 5,
    },

    labelTxt: {
        fontSize: 18,
    },

    viewContainer: {
        flex: 1,
        marginVertical: 5,
    },

    title: {
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 16,
        color: configs.colors.dark,
        paddingLeft: 30,
        paddingRight: 30,
        fontWeight: '900',
        opacity: 0.6,
        textTransform: 'uppercase',
    },

    back2Login: {
        alignItems: 'center',
        paddingBottom: 20,
    },

    back2LoginTxt: {
        color: configs.colors.primary,
        fontSize: 18,
        textAlign: 'center',
    },

    required: {
        color: configs.colors.danger,
    },

    textInput: {
        backgroundColor: configs.colors.white,
        color: configs.colors.silver,
    }
})