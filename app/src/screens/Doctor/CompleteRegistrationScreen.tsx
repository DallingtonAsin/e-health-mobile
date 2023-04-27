import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Button, Image, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import { displayMessage, formatNumber, removeCommas } from '../../components/common/SharedHelper';
import { Context as AppContext } from '../../context/appContext';
import { Context as AuthContext } from '../../context/authContext';
import { Context as DoctorContext } from '../../context/doctorContext';
import { FileUpload, IUser } from '../../interfaces';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { initialFileUpload, initialUser } from '../../configs/constants';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

const CompleteRegistrationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(true);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [frontImage, setFrontImage] = useState<FileUpload>(initialFileUpload);
    const [backImage, setBackImage] = useState<FileUpload>(initialFileUpload);
    const [user, setUser] = useState<IUser>(initialUser);
    const [specialties, setSpecialties] = useState([]);
    const [isFetchingFacilities, setIsFetchingFacilities] = useState(true);
    const { updateUserState } = useContext(AuthContext);
    const { getDoctorSpecialties } = useContext(AppContext);
    const { completeRegistration, getMedicalFacilities } = useContext(DoctorContext);

    useEffect(() => {
        getDoctorSpecialties({ onSuccess: populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } });
        getMedicalFacilities({ onSuccess: populateFacilities, onFailure: displayMessage, onCompletion: () => { setIsFetchingFacilities(false) } });
    }, []);

    const populateFacilities = (data: any) => {
        setFacilities(data);
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

        if (!user.facility) {
            Toast.show('Select your primary facility or workplace', Toast.LONG);
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

        if (!user.training_institute) {
            Toast.show('Enter your latest training institute', Toast.LONG);
            return;
        }

        if (!user.lincense_number) {
            Toast.show('Select your UMDP lincense number', Toast.LONG);
            return;
        }

        if (!user.service_fee) {
            Toast.show('Enter your service fee', Toast.LONG);
            return;
        }

        if (!frontImage.uri) {
            Toast.show('Please upload your front image of ID', Toast.LONG);
            return;
        }

        if (!backImage.uri) {
            Toast.show('Please upload your back image of ID', Toast.LONG);
            return;
        }

        let service_fee = removeCommas(user.service_fee);

        const formData = new FormData();
        formData.append('specialty', user.specialty);
        formData.append('facility', user.facility);
        formData.append('address', user.address);
        formData.append('qualification', user.qualification);
        formData.append('training_institute', user.training_institute);
        formData.append('lincense_number', user.lincense_number,);
        formData.append('service_fee', service_fee);
        formData.append('other_facilities', selectedFacilities);
        formData.append('front_image', frontImage);
        formData.append('back_image', backImage);

        setIsLoading(true);
        completeRegistration({ payload: formData, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const onSuccess = async () => {
        updateUserState({ onSuccess: navigation.navigate('SignedInStack', { screen: 'Home' }) });
    }

    const chooseImage = (num: number) => {
        try {
            launchImageLibrary({ mediaType: 'photo' }, (response: any) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    resizeImage(response, num);
                }
            });
        } catch (error) {
            console.log(`error on choosing image`, error);
        }
    };

    const resizeImage = (response: any, num: number) => {
        let assest_obj = response.assets
        let uri = assest_obj[0].uri
        let file_name = assest_obj[0].fileName
        let type = assest_obj[0].type
        // console.log(`file uri`, uri)

        ImageResizer.createResizedImage(uri, 500, 500, 'JPEG', 80).then((resizedImage: any) => {
            const filePath = resizedImage.uri;
            console.log(`resized image uri`, filePath)

            RNFS.readFile(filePath, 'base64').then((base64String) => {
                const source: any = { uri: `data:image/jpeg;base64,${base64String}` };
                const file_obj = {
                    uri: uri,
                    source: source,
                    name: file_name,
                    type: type,
                }
                // console.log(`file obj`, file_obj)
                if (num == 1) {
                    setFrontImage(file_obj);
                } else {
                    setBackImage(file_obj)
                }
            });
        }).catch((err: unknown) => {
            console.log(`Error`, err);
        });;

    };


    return (
        <React.Fragment>
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
                        <Text style={config.styles.registration.doctor.labelTxt}>Speciality
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                            data={specialties}
                            save="value"
                            search={false}
                            placeholder={"Select specialty"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Primary Facility (Latest)
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, facility: val }))}
                            data={facilities}
                            save="value"
                            search={false}
                            placeholder={"Select Primary Facility"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Other facilities
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <MultipleSelectList
                            setSelected={(val: string[]) => setSelectedFacilities(val)}
                            data={facilities}
                            save="value"
                            search={false}
                            placeholder={"Select other facilities(s)"}
                            inputStyles={config.styles.registration.doctor.selectInputStyles}
                            boxStyles={config.styles.registration.doctor.selectBoxStyles}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Address<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Physical Address"
                            value={user.address}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            placeholder='E.g plot 45, Kafumbe Road Mengo'
                            onChangeText={text => setUser(prev => ({ ...prev, address: text }))}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Qualification (Lastest)<Text style={config.styles.registration.doctor.required}>*</Text></Text>
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
                        <Text style={config.styles.registration.doctor.labelTxt}>Training institute (Latest)
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Training institute"
                            value={user.training_institute}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, training_institute: text })}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>UMDP Lincense Number
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="UMDP Lincense number"
                            value={user.lincense_number}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, lincense_number: text })}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Consultation fee (per 15min)
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

                    <View>
                        <Text style={config.styles.registration.doctor.labelTxt}>National ID
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <View style={{ marginVertical: 10 }}>
                            {frontImage && frontImage.source && <Image source={frontImage.source} style={{ width: 150, height: 150 }} />}
                            <Button title="Choose Front Image (ID)" onPress={() => chooseImage(1)} color={config.colors.primary} />
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            {backImage && backImage.source && <Image source={backImage.source} style={{ width: 150, height: 150 }} />}
                            <Button title="Choose Back Image (ID)" onPress={() => chooseImage(2)} color={config.colors.primary} />
                        </View>
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer, { marginBottom: 40 }]}>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {(isLoading || isFetchingSpecialties || isFetchingFacilities) && <AppLoader />}
        </React.Fragment>
    )
}


export default CompleteRegistrationScreen;