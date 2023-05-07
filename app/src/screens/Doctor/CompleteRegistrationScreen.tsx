import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Button, Image, StatusBar, Linking, Alert } from 'react-native'
import * as config from '../../configs'
import { TextInput, Checkbox } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import Toast from 'react-native-simple-toast'
import { displayMessage, formatNumber, removeCommas } from '../../components/common/SharedHelper'
import { Context as AppContext } from '../../context/appContext'
import { Context as AuthContext } from '../../context/authContext'
import { Context as DoctorContext } from '../../context/doctorContext'
import { DrCompleteProfilePayload, FileUpload } from '../../interfaces'
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import { DrCompleteProfileInitialState, initialFileUpload } from '../../configs/constants'
import { ValidateDrCompleteProfile } from '../../components/common/validation'
import { choosePhotoFromLibrary, getImageData } from '../../components/common/FileHelper'

const CompleteRegistrationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(true);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [frontImage, setFrontImage] = useState<FileUpload>(initialFileUpload);
    const [backImage, setBackImage] = useState<FileUpload>(initialFileUpload);
    const [user, setUser] = useState<DrCompleteProfilePayload>(DrCompleteProfileInitialState);
    const [specialties, setSpecialties] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [isFetchingFacilities, setIsFetchingFacilities] = useState(true);
    const { updateUserState } = useContext(AuthContext);
    const { getMedicalSpecialties } = useContext(AppContext);
    const { completeRegistration, getMedicalFacilities } = useContext(DoctorContext);

    useEffect(() => {
        getMedicalSpecialties({ onSuccess: populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } });
        getMedicalFacilities({ onSuccess: populateFacilities, onFailure: displayMessage, onCompletion: () => { setIsFetchingFacilities(false) } });
    }, []);

    const populateSpecialties = (data: any) => {
        const arr = data.map((item: { id: number, name: string }) => {
            return { key: item.id, value: item.name }
        })
        setSpecialties(arr);
    }

    const populateFacilities = (data: any) => {
        const newArr = data.map((item: { id: number, name: string }) => {
            return { key: item.id, value: item.name }
        })
        setFacilities(newArr);
    }

    const handleServiceFeeChange = (text: string) => {
        const formattedValue = formatNumber(text.replace(/,/g, ''));
        setUser(prev => ({ ...prev, service_fee: formattedValue }));
    }

    const handleMWorkerTermsPress = () => {
        Linking.openURL('https://example.com/terms-and-conditions');
    }

    const submitDetails = () => {

        const validationError = ValidateDrCompleteProfile(user, selectedFacilities, hasAgreedTerms, frontImage, backImage);
        if (validationError) {
            Toast.show(validationError, Toast.LONG)
            return;
        }
        let service_fee = removeCommas(user.service_fee);

        const formData = new FormData();
        formData.append('specialty', user.specialty);
        formData.append('primary_facility', user.primary_facility);
        formData.append('other_facilities', JSON.stringify(selectedFacilities));
        formData.append('address', user.address);
        formData.append('bio_summary', user.bio_summary);
        formData.append('qualification', user.qualification);
        formData.append('training_institute', user.training_institute);
        formData.append('umdp_license_id', user.umdp_license_id,);
        formData.append('service_fee', service_fee);
        formData.append('front_image', frontImage);
        formData.append('back_image', backImage);

        setIsLoading(true);
        completeRegistration({ payload: formData, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const onSuccess = async (message: string) => {
        setUser(DrCompleteProfileInitialState)
        setHasAgreedTerms(false)
        setFrontImage(initialFileUpload)
        setBackImage(initialFileUpload)

        updateUserState({
            onSuccess: () => {
                Alert.alert(
                    `Message`,
                    `${message}`,
                    [{
                        text: 'OK', onPress: () => { navigation.navigate('SignedInStack', { screen: 'Home' }) }
                    }],
                    { cancelable: false }
                )
            }
        })
    }

    const uploadFrontImage = () => {
        choosePhotoFromLibrary().then((image: any) => {
            const imageData = getImageData(image)
            setFrontImage(imageData)
        }).catch((error: any) => {
            // Toast.show(`Error while uploading image ${error.message}`)
        })
    }

    const uploadBackImage = () => {
        choosePhotoFromLibrary().then((image: any) => {
            const imageData = getImageData(image)
            setBackImage(imageData)
        }).catch((error: any) => {
            // Toast.show(`Error while uploading image ${error.message}`)
        })
    }


    return (
        <React.Fragment>
            <SafeAreaView style={config.styles.registration.doctor.container}>
                <StatusBar backgroundColor={config.colors.primary} />
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}
                    showsVerticalScrollIndicator={false}>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Speciality
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                            data={specialties}
                            save="value"
                            search={true}
                            placeholder={"Select specialty"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Primary Facility (Latest)
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, primary_facility: val }))}
                            data={facilities}
                            save="value"
                            search={true}
                            placeholder={"Select primary facility"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Other facilities</Text>
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
                        <Text style={config.styles.registration.doctor.labelTxt}>Bio Summary<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            editable
                            mode="outlined"
                            label={"Bio Summary"}
                            value={user.bio_summary}
                            onChangeText={text => setUser(prev => ({ ...prev, bio_summary: text }))}
                            multiline={true}
                            numberOfLines={4}
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            placeholder={""}
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
                        <Text style={config.styles.registration.doctor.labelTxt}>UMDP license Number
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="UMDP license number"
                            value={user.umdp_license_id}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setUser({ ...user, umdp_license_id: text })}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Consultation fee (per 15min)
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Consultation Fee"
                            value={user.service_fee}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            keyboardType="numeric"
                            onChangeText={text => handleServiceFeeChange(text)}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>National ID / Passport ID
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <View style={{ marginVertical: 10 }}>
                            {frontImage && frontImage.uri && <Image source={{ uri: frontImage.uri }} style={config.styles.documentId} />}
                            <Button title="Choose Front Image (ID)" onPress={() => uploadFrontImage()} color={config.colors.primary} />
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            {backImage && backImage.uri && <Image source={{ uri: backImage.uri }} style={config.styles.documentId} />}
                            <Button title="Choose Back Image (ID)" onPress={() => uploadBackImage()} color={config.colors.primary} />
                        </View>
                    </View>


                    <View style={[config.styles.registration.doctor.viewContainer, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                        <Checkbox
                            status={hasAgreedTerms ? 'checked' : 'unchecked'}
                            color={config.colors.primary}
                            onPress={() => setHasAgreedTerms(!hasAgreedTerms)}
                        />
                        <TouchableOpacity onPress={handleMWorkerTermsPress}>
                            <Text style={{ color: config.colors.grey, fontSize: 16 }}>
                                I agree to {' '}
                                <Text style={{ textDecorationLine: 'underline', color: config.colors.terms }} onPress={handleMWorkerTermsPress}>
                                    Vastel medical worker agreement
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer]}>
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

export default CompleteRegistrationScreen