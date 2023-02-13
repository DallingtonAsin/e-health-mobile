import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, isValidEmail, getJsonObjByValue } from '../../components/common/SharedHelper';
import { Context as AppContext } from '../../context/appContext';
import { IUser } from '../../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';
import { HOSPITAL_NAME } from '@env';


const numberOfLines = 5;

const DoctorRegistrationScreen = ({ navigation }: { navigation: any }) => {

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
    const [languages, setLanguages] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    // const [isForm1Filled, setIsForm1Filled] = useState(false);

    const [isFetchingLanguages, setIsFetchingLanguages] = useState(true);
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(true);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [gender, setGender] = useState("");
    const { signup, getDoctorLanguages, getDoctorSpecialties } = useContext(AppContext);

    const genderOptions = [
        {key:'1', value:'Male'},
        {key:'2', value:'Female'},
    ];

    const titleOptions = [
        {key:'1', value:'Dr.'},
        {key:'2', value:'Mr.'},
        {key:'3', value:'Mrs.'},
        {key:'4', value:'Ms.'},
    ];

    useEffect(() => {
            getDoctorLanguages({onSuccess:populateLanguages, onFailure: displayMessage, onCompletion: () => { setIsFetchingLanguages(false) } });
            getDoctorSpecialties({onSuccess:populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } });
    }, []);

    const populateLanguages = (data:any) => {
        setLanguages(data);
    }

    const populateSpecialties = (data:any) => {
        setSpecialties(data);
    }

    const submitDetails = () => {

        if (!user.first_name) {
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if (!user.last_name) {
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if(!user.email){
            Toast.show('Enter your email address', Toast.LONG);
        }

        if(!isValidEmail(user.email)){
            Toast.show('Please enter a valid email', Toast.LONG);
            return;
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

        signup({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
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
                    <Text style={styles.title}>Medical Doctor Registration</Text>

                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>First Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="First Name"
                            value={user.first_name}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={numberOfLines}
                            // error={!user.first_name}
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
                            // error={!user.last_name}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, last_name: text })}
                        />
                    </View>

                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>Specialty<Text style={styles.required}>*</Text></Text>
                        <SelectList 
                                setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                                data={specialties} 
                                save="value"
                                search={false}
                                placeholder={"Select Specialty"}
                                inputStyles={{color: config.colors.black}}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                            />
                    </View>

                    <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Title<Text style={styles.required}>*</Text></Text>
                            <SelectList 
                                setSelected={(val: string) => setUser(prev => ({ ...prev, title: val }))} 
                                data={titleOptions} 
                                save="value"
                                search={false}
                                placeholder={"Select Title"}
                                inputStyles={{color: config.colors.black}}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                            />
                        </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Email<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Email address"
                            value={user.email}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            // error={!user.email}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, email: text }))}
                        />
                    </View>


                    {/* <View style={styles.viewContainer}>
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
                    </View> */}

                    <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                            <SelectList 
                                 setSelected={(val: string) => setUser(prev => ({ ...prev, gender: val }))} 
                                data={genderOptions} 
                                save="value"
                                search={false}
                                inputStyles={{color: config.colors.black}}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
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
                                // error={!user.dob}
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
                        <TouchableOpacity style={[config.styles.secondaryBtn, {width: '100%'}]}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText]}>Next</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading || isFetchingLanguages || isFetchingSpecialties && <AppLoader />}
        </>
    )
}


export default DoctorRegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
        marginVertical: 10,
        marginHorizontal: 6,
        elevation: 8,
        borderRadius: 8,
        shadowColor: config.colors.gray,
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
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
        fontSize: config.fonts.extraLarge,
        fontWeight: '800',
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