import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import { displayMessage } from '../../components/common/SharedHelper';
import { Context as AppContext } from '../../context/appContext';
import { IUser } from '../../interfaces';
import { MultipleSelectList } from 'react-native-dropdown-select-list';


const CompleteRegistrationScreen = ({ navigation, user, setUser }: {navigation:any, user: IUser, setUser: React.Dispatch<React.SetStateAction<IUser>> }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const [isFetchingLanguages, setIsFetchingLanguages] = useState(true);
    const { registerDoctor, getDoctorLanguages } = useContext(AppContext);

    useEffect(() => {
        getDoctorLanguages({ onSuccess: populateLanguages, onFailure: displayMessage, onCompletion: () => { setIsFetchingLanguages(false) } });
    }, []);

    const populateLanguages = (data: any) => {
        setLanguages(data);
    }

    const submitDetails = () => {

        if (!user.address) {
            Toast.show('Enter your address', Toast.LONG);
            return;
        }

        if (!user.qualification) {
            Toast.show('Enter your qualification', Toast.LONG);
            return;
        }

        if (!user.profession) {
            Toast.show('Enter your profession', Toast.LONG);
        }

        if (selectedLanguages.length < 0) {
            Toast.show('Select atleast one language', Toast.LONG);
            return;
        }

        if (!user.experience) {
            Toast.show('Select your experience', Toast.LONG);
            return;
        }

        if (!user.service_fee) {
            Toast.show('Enter your service fee', Toast.LONG);
            return;
        }


        let payload: IUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            specialty: user.specialty,
            title: user.title,
            email: user?.email,
            address: user.address,
            gender: user.gender,
            qualification: user.qualification,
            profession: user.profession,
            dob: user.dob,
            languages: selectedLanguages,
            experience: user.experience,
            service_fee: user.service_fee
        }
        payload.phone_number && delete payload.phone_number;
       
        setIsLoading(true);
       registerDoctor({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const navigateMethod = async (data: any) => {
        navigation.navigate('Home');
    }

    return (
        <>
            <SafeAreaView style={config.styles.registration.doctor.container}>

                <StatusBar
                    backgroundColor={config.colors.primary}
                />

                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}>
                    <Text style={config.styles.registration.doctor.title}>Complete Registration</Text>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Address<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Address"
                            value={user.address}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, address: text }))}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Qualification<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Qualification"
                            value={user.qualification}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={5}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser(prev => ({ ...prev, qualification: text }))}
                            placeholder="E.g Bsc, Msc"

                        />
                    </View>


                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Profession
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Profession"
                            value={user.profession}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, profession: text })}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Languages
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <MultipleSelectList
                            setSelected={(val: string[]) => setSelectedLanguages(val)} 
                            data={languages}
                            save="value"
                            search={false}
                            placeholder={"Select Language(s)"}
                            inputStyles={config.styles.registration.doctor.selectInputStyles} 
                            boxStyles={config.styles.registration.doctor.selectBoxStyles}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Experience
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Experience"
                            value={user.experience}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, experience: text })}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Service Fee
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Service Fee"
                            value={user.service_fee}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            keyboardType="numeric"
                            onChangeText={text => setUser(prev => ({ ...prev, service_fee: text }))}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            { (isLoading || isFetchingLanguages) && <AppLoader />}
        </>
    )
}


export default CompleteRegistrationScreen;