import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as config from '../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, isValidEmail } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { IUser } from '../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';

const numberOfLines = 5;

const SignupScreen = ({ navigation }: { navigation: any }) => {

    const InitialUser = {
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: '',
        address: '',
        phone_number: '',
        profile_status: false,
    }

    const [user, setUser] = useState<IUser>(InitialUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [gender, setGender] = useState("");
    const { signup } = useContext(AuthContext);

    const genderOptions = [
        {key:'1', value:'Male'},
        {key:'2', value:'Female'},
    ];

    const submitDetails = () => {

        if (!user.first_name) {
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if (!user.last_name) {
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if(user.email){
            if(!isValidEmail(user.email)){
                Toast.show('Please enter a valid email', Toast.LONG);
                return;
            }
        }

        if (!user.address) {
            Toast.show('Enter your address', Toast.LONG);
            return;
        }

        if (!gender) {
            Toast.show('Select your gender', Toast.LONG);
            return;
        }

        if (!user.dob) {
            Toast.show('Enter your date of birth', Toast.LONG);
            return;
        }

        setIsLoading(true);

        let payload: IUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user?.email,
            address: user.address,
            gender: gender,
            dob: user.dob
        }

       signup({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });
  
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const navigateMethod = async (data: any) => {
        navigation.navigate('Home');
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
                    backgroundColor={config.colors.primary}
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
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={numberOfLines}
                            error={!user.first_name}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, first_name: text }))}

                        />
                    </View>


                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>Last Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Last Name"
                            value={user.last_name}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            error={!user.last_name}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, last_name: text })}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Email address</Text>
                        <TextInput
                            label="Email address"
                            value={user.email}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, email: text }))}
                        />
                    </View>


                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Address<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Address"
                            value={user.address}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            error={!user.address}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, address: text }))}
                        />
                    </View>

                    <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                            <SelectList 
                                setSelected={(val: string) => setGender(val)} 
                                data={genderOptions} 
                                save="value"
                                search={false}
                                placeholder={"Select Gender"}
                                inputStyles={{color: gender ? config.colors.black : config.colors.danger, fontWeight: gender ? 'normal' : '500' }}
                                boxStyles={{ borderColor: gender ? config.colors.gray : config.colors.danger, borderWidth: gender ? 1 : 2, borderRadius: 4, marginTop: 6, height: 49 }}
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Date of Bith<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Date of Birth"
                                value={user.dob}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                error={!user.dob}
                                textColor={config.colors.dark}
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={text => setUser(prev => ({ ...prev, dob: text }))}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                display='inline'
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                
                            />
                        </View>
                    </View>

                    <View style={styles.viewContainer}>
                        <TouchableOpacity style={config.styles.secondaryBtn}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText]}>Continue</Text>
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
        backgroundColor: config.colors.white,
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
        color: config.colors.dark,
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
        color: config.colors.primary,
        fontSize: 18,
        textAlign: 'center',
    },

    required: {
        color: config.colors.danger,
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
    }
})