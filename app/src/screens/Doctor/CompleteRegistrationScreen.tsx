import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Linking, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput, Checkbox } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import { displayMessage, formatNumber, removeCommas } from '../../components/common/SharedHelper';
import { Context as AppContext } from '../../context/appContext';
import { Context as AuthContext } from '../../context/authContext';
import { IUser } from '../../interfaces';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { initialUser } from '../../configs/constants';
import { SelectList } from 'react-native-dropdown-select-list';

const CompleteRegistrationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(true);
    const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [user, setUser] = useState<IUser>(initialUser);
    const [specialties, setSpecialties] = useState([]);
    const [isFetchingLanguages, setIsFetchingLanguages] = useState(true);
    const { getDoctorLanguages } = useContext(AppContext);
    const { registerDoctor } = useContext(AuthContext);
    const { getDoctorSpecialties } = useContext(AppContext);

    const titleOptions = [
        { key: '1', value: 'Dr.' },
        { key: '2', value: 'Mr.' },
        { key: '3', value: 'Mrs.' },
        { key: '4', value: 'Ms.' },
    ];


    useEffect(() => {
        getDoctorSpecialties({ onSuccess: populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } });
        getDoctorLanguages({ onSuccess: populateLanguages, onFailure: displayMessage, onCompletion: () => { setIsFetchingLanguages(false) } });
    }, []);

    const populateLanguages = (data: any) => {
        setLanguages(data);
    }

    const populateSpecialties = (data: any) => {
        setSpecialties(data);
    }

    const handleServiceFeeChange = (text: string) => {
        const formattedValue = formatNumber(text.replace(/,/g, ''));
        setUser(prev => ({ ...prev, service_fee: formattedValue }));
    }

    const submitDetails = () => {

        if (!user.specialty) {
            Toast.show('Select your specialty', Toast.LONG);
            return;
        }

        if (!user.title) {
            Toast.show('Select your title', Toast.LONG);
            return;
        }

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

        if (!hasAgreedTerms) {
            Toast.show('Please agree to our terms and conditions before signup', Toast.LONG);
            return;
        }

        let service_fee = removeCommas(user.service_fee);

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
            service_fee: service_fee
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
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    >


                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Category
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                            data={specialties}
                            save="value"
                            search={false}
                            placeholder={"Select category"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Title
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, title: val }))}
                            data={titleOptions}
                            save="value"
                            search={false}
                            placeholder={"Select Title"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

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
                        <Text style={config.styles.registration.doctor.labelTxt}>Service Fee per 15 minutes
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Service Fee"
                            value={user.service_fee}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            keyboardType="numeric"
                            onChangeText={text => handleServiceFeeChange(text)}
                        />
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer, {marginBottom: 40 }]}>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {(isLoading || isFetchingLanguages) && <AppLoader />}
        </>
    )
}


export default CompleteRegistrationScreen;