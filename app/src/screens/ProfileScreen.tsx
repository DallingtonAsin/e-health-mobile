import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Image, StatusBar, Alert, ViewStyle, Pressable, TextStyle } from 'react-native'
import { TextInput } from 'react-native-paper'
import * as config from '../configs'
import { Avatar as AvatarRP, IconButton } from 'react-native-paper'
import Avatar from '../components/Avatar'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-simple-toast'
import AppLoader from '../components/AppLoader'
import { Context as AppContext } from '../context/appContext'
import { Context as AuthContext } from '../context/authContext'
import { Context as DoctorContext } from '../context/doctorContext'
import { FileUpload, IUser } from '../interfaces'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { formatDate, displayMessage, getUserInitials, getJsonObjByValue, formatNumber, removeCommas, getPairByKey } from '../components/common/SharedHelper'
import { UIActivityIndicator } from 'react-native-indicators'
import { BottomSheet } from 'react-native-btr'
import { SelectList } from 'react-native-dropdown-select-list'
import { validateProfileUpdate } from '../components/common/validation'
import { initialFileUpload } from '../configs/constants'
import { choosePhotoFromLibrary, getImageData, takePhotoFromCamera } from '../components/common/FileHelper'


const ProfileScreen = ({ navigation }: { navigation: any }) => {

    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingFacilities, setIsFetchingFacilities] = useState(false)
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(false)
    const [visible, setVisible] = useState(false)
    const [updateFrontID, setUpdateFrontID] = useState(false)
    const [updateBackID, setUpdateBackID] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isUpdatingImage, setIsUpdatingImage] = useState(false)
    const [facilities, setFacilities] = useState([])
    const [frontImage, setFrontImage] = useState<FileUpload>(initialFileUpload)
    const [backImage, setBackImage] = useState<FileUpload>(initialFileUpload)
    const [specialties, setSpecialties] = useState([])
    const [selectedFacilities, setSelectedFacilities] = useState<number[]>([])
    const { state, updateUserState } = useContext(AuthContext)
    const { getMedicalFacilities } = useContext(DoctorContext)
    const { getMedicalSpecialties, updateProfile, updateProfileImage, deleteProfileImage } = useContext(AppContext)
    const [user, setUser] = useState<IUser>(state.user)

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ]

    useEffect(() => {
        if (!user.is_patient) {
            const otherFacilities: number[] | any = user.other_facilities
            if (otherFacilities != undefined || otherFacilities != null) {
                if (otherFacilities.length > 0) {
                    setSelectedFacilities(otherFacilities)
                }
            }
            setIsFetchingFacilities(true)
            setIsFetchingSpecialties(true)
            getMedicalSpecialties({ onSuccess: populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } })
            getMedicalFacilities({ onSuccess: populateFacilities, onFailure: displayMessage, onCompletion: () => { setIsFetchingFacilities(false) } })
        }
    }, [])

    const populateSpecialties = (data: any) => {
        const arr = data.map((item: { id: number, name: string }) => {
            return { key: item.id, value: item.name }
        })
        setSpecialties(arr)
    }

    const populateFacilities = (data: any) => {
        const newArr = data.map((item: { id: number, name: string }) => {
            return { key: item.id, value: item.name }
        })
        setFacilities(newArr)
    }

    const handleServiceFeeChange = (text: string) => {
        const formattedValue = formatNumber(text.replace(/,/g, ''))
        setUser(prev => ({ ...prev, service_fee: formattedValue }))
    }

    const submitProfile = () => {

        if (!isDisabled) {

            const validationError = validateProfileUpdate(user, selectedFacilities)
            if (validationError) {
                Toast.show(validationError, Toast.LONG)
                return
            }

            const formData = new FormData()

            formData.append('_method', 'put')
            formData.append('first_name', user.first_name)
            formData.append('last_name', user.last_name)
            formData.append('email', user?.email)
            formData.append('address', user.address)
            formData.append('gender', user.gender)
            formData.append('dob', user.dob)
            formData.append('specialty', user.specialty)

            if (!user.is_patient) {

                const service_fee = removeCommas(user.service_fee)

                formData.append('specialty', user.specialty)
                formData.append('primary_facility', user.primary_facility)
                formData.append('qualification', user.qualification)
                formData.append('other_facilities', JSON.stringify(selectedFacilities))
                formData.append('training_institute', user.training_institute)
                formData.append('umdp_license_id', user.umdp_license_id)
                formData.append('bio_summary', user.bio_summary)
                formData.append('service_fee', service_fee)
                formData.append('update_front_id', updateFrontID)
                formData.append('update_back_id', updateBackID)

                if (updateFrontID) {
                    formData.append('front_image', frontImage)
                }
                if (updateBackID) {
                    formData.append('back_image', backImage)
                }
            }

            setIsLoading(true)
            const is_patient = user.is_patient || false
            updateProfile({ payload: formData, is_patient: is_patient, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })

        } else {
            setIsDisabled(!isDisabled)
        }
    }

    const onSuccess = async (message: string) => {
        updateUserState({
            onSuccess: () => {
                displayMessage(message)
                navigation.navigate('SignedInStack', { screen: 'Profile' })
                setIsDisabled(true)
            }
        })
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    const handleConfirm = (date: Date) => {
        hideDatePicker()
        let dob = formatDate(date)
        setUser({
            ...user,
            dob: dob
        })
    }

    const uploadFrontImage = () => {
        choosePhotoFromLibrary().then((image: any) => {
            setUpdateFrontID(true)
            const imageData = getImageData(image)
            setFrontImage(imageData)
        }).catch((error: any) => {
            Toast.show(`Error while uploading image ${error.message}`)
        })
    }

    const uploadBackImage = () => {
        choosePhotoFromLibrary().then((image: any) => {
            setUpdateBackID(true)
            const imageData = getImageData(image)
            setBackImage(imageData)
        }).catch((error: any) => {
            Toast.show(`Error while uploading image ${error.message}`)
        })
    }

    const uploadImageByCamera = () => {
        takePhotoFromCamera().then((image: any) => {
            const imageData = getImageData(image)
            submitProfilePicture(imageData)
        }).catch((error: any) => {
            Toast.show(`Error while uploading image ${error.message}`)
        })
    }

    const uploadImageFromGallery = () => {
        choosePhotoFromLibrary().then((image: any) => {
            const imageData = getImageData(image)
            submitProfilePicture(imageData)
        }).catch((error: any) => {
            Toast.show(`Error while uploading image ${error.message}`)
        })
    }


    const submitProfilePicture = async (imageData: FileUpload) => {
        try {
            const formData = new FormData()
            const is_patient = user.is_patient || false
            formData.append('id', user.id)
            formData.append('image', imageData)

            setIsUpdatingImage(true)
            updateProfileImage({ payload: formData, is_patient: is_patient, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: closeLoader })

        } catch (err: any) {
            Toast.show(err.message, Toast.LONG)
        }
    }

    const closeLoader = () => {
        setIsUpdatingImage(false)
        setVisible(false)
    }

    const deleteProfilePicture = async () => {
        try {
            const user_obj = {
                id: user.id,
                is_patient: user.is_patient
            }
            setIsUpdatingImage(true)
            deleteProfileImage({ user: user_obj, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: closeLoader })
        } catch (err: any) {
            Toast.show(err.message, Toast.LONG)
        }
    }

    const confirmRemovePicture = () => {
        Alert.alert(
            "Warning",
            "Are you sure you want to remove your profile picture?",
            [
                {
                    text: "OK",
                    onPress: () => { deleteProfilePicture() },
                    style: "cancel",
                },
            ],
            {
                cancelable: true,
            }
        )
    }

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={config.colors.primary} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon5 name="arrow-left" size={20} style={{ marginLeft: 20 }} color={config.colors.white} />
                    </TouchableOpacity>

                    <View style={styles.userProfile}>
                        {
                            !isUpdatingImage ?
                                <View style={{ position: 'relative' }}>
                                    {state.user.image
                                        ? <Pressable onPress={() => setVisible(!visible)}><Avatar size={80} source={state.user.image} resizeMode={'cover'} /></Pressable>
                                        : <Pressable onPress={() => setVisible(!visible)}><AvatarRP.Text size={80} label={getUserInitials(`${state.user.first_name} ${state.user.last_name}`)} style={config.styles.userAvatar} /></Pressable>
                                    }

                                    {!isDisabled && <IconButton
                                        icon="pencil"
                                        iconColor={config.colors.white}
                                        size={15}
                                        onPress={() => setVisible(!visible)}
                                        style={styles.camera}
                                    />}
                                </View>
                                :
                                <View style={styles.profile_avatar}>
                                    <UIActivityIndicator color='black' size={27} />
                                </View>
                        }

                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            {user.is_patient && <Text style={[styles.usernameText]}>{user.first_name} {user.last_name}</Text>}
                            {!user.is_patient && <Text style={[styles.usernameText]}>{`Dr.`} {user.first_name} {user.last_name}</Text>}
                            <Text style={[styles.headerText]}>
                                {<><Text> {user.is_patient ? `Patient Account` : `Doctor Account`} </Text></>}
                            </Text>
                            <TouchableOpacity style={styles.editProfileBtn} onPress={() => setIsDisabled(!isDisabled)}>
                                <Text style={styles.editProfileTxt}><Icon5 name={isDisabled ? 'pen' : 'eye'} size={10} color={config.colors.silver} /> {isDisabled ? 'Edit' : 'View'} profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>



                    <View style={styles.body}>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>First Name
                                {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <TextInput
                                mode='outlined'
                                value={user.first_name}
                                disabled={isDisabled}
                                activeOutlineColor={config.colors.primary}
                                style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                onChangeText={text => setUser(prev => ({ ...prev, first_name: text }))}
                            />
                        </View>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Last Name
                                {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <TextInput
                                mode='outlined'
                                value={user.last_name}
                                disabled={isDisabled}
                                activeOutlineColor={config.colors.primary}
                                style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                onChangeText={text => setUser(prev => ({ ...prev, last_name: text }))}
                            />
                        </View>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Address
                                {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <TextInput
                                mode='outlined'
                                value={user.address}
                                disabled={isDisabled}
                                activeOutlineColor={config.colors.primary}
                                style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                onChangeText={text => setUser(prev => ({ ...prev, address: text }))}
                            />
                        </View>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Email
                                {!isDisabled && !user.is_patient && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <TextInput
                                mode='outlined'
                                value={user.email}
                                disabled={isDisabled}
                                activeOutlineColor={config.colors.primary}
                                style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                onChangeText={text => setUser(prev => ({ ...prev, email: text }))}
                            />
                        </View>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Gender
                                {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <SelectList
                                setSelected={(val: string) => setUser(prev => ({ ...prev, gender: val }))}
                                data={genderOptions}
                                save="value"
                                search={false}
                                defaultOption={getJsonObjByValue(genderOptions, user.gender)}
                                placeholder={"Select Gender"}
                                inputStyles={isDisabled ? { color: config.colors.disabled } : { color: config.colors.black }}
                                boxStyles={isDisabled ? styles.disabledBoxStyle : styles.enabledBoxStyle}
                            />
                        </View>


                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Date of Birth
                                {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                            </Text>
                            <TextInput
                                value={user.dob}
                                disabled={isDisabled}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                error={!user.dob}
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={text => setUser(prev => ({ ...prev, dob: text }))}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </View>


                        {!user.is_patient && (user.is_registered ?
                            <React.Fragment>
                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Speciality
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <SelectList
                                        setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                                        data={specialties}
                                        save="key"
                                        search={true}
                                        placeholder={"Select specialty"}
                                        defaultOption={getPairByKey(specialties, user.specialty_id)}
                                        inputStyles={isDisabled ? styles.disabledSelectTextStyle : styles.enabledSelectTextStyle}
                                        boxStyles={isDisabled ? styles.disabledSelectBoxStyles : styles.enabledSelectBoxStyles}
                                    />
                                </View>

                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Primary Facility (Latest)
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <SelectList
                                        setSelected={(val: string) => setUser(prev => ({ ...prev, primary_facility: val }))}
                                        data={facilities}
                                        save="key"
                                        search={true}
                                        placeholder={"Select primary facility"}
                                        defaultOption={getPairByKey(facilities, user.primary_facility_id)}
                                        inputStyles={isDisabled ? styles.disabledSelectTextStyle : styles.enabledSelectTextStyle}
                                        boxStyles={isDisabled ? styles.disabledSelectBoxStyles : styles.enabledSelectBoxStyles}
                                    />
                                </View>


                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Qualification
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <TextInput
                                        mode='outlined'
                                        value={user.qualification}
                                        disabled={isDisabled}
                                        activeOutlineColor={config.colors.primary}
                                        style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                        onChangeText={text => setUser(prev => ({ ...prev, qualification: text }))}
                                    />
                                </View>


                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Training institute
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <TextInput
                                        mode='outlined'
                                        value={user.training_institute}
                                        disabled={isDisabled}
                                        activeOutlineColor={config.colors.primary}
                                        style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                        onChangeText={text => setUser(prev => ({ ...prev, training_institute: text }))}
                                    />
                                </View>


                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>License Number
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <TextInput
                                        mode='outlined'
                                        value={user.umdp_license_id}
                                        disabled={isDisabled}
                                        activeOutlineColor={config.colors.primary}
                                        style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                        onChangeText={text => setUser(prev => ({ ...prev, umdp_license_id: text }))}
                                    />
                                </View>


                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Bio Summary
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <TextInput
                                        editable
                                        mode="outlined"
                                        label={"Bio Summary"}
                                        value={user.bio_summary}
                                        disabled={isDisabled}
                                        onChangeText={text => setUser(prev => ({ ...prev, bio_summary: text }))}
                                        multiline={true}
                                        numberOfLines={4}
                                        activeOutlineColor={config.colors.primary}
                                        style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                        placeholder={""}
                                    />
                                </View>

                                <View style={styles.detailView}>
                                    <Text style={styles.infoText}>Consultation fee (per 15min)
                                        {!isDisabled && <Text style={config.styles.registration.doctor.required}>*</Text>}
                                    </Text>
                                    <TextInput
                                        mode="outlined"
                                        label="Consultation Fee"
                                        value={formatNumber(user.service_fee)}
                                        disabled={isDisabled}
                                        activeOutlineColor={config.colors.primary}
                                        style={isDisabled ? styles.disabledInput : styles.enabledInput}
                                        keyboardType="numeric"
                                        onChangeText={text => handleServiceFeeChange(text)}
                                    />
                                </View>

                                <View style={config.styles.registration.doctor.viewContainer}>
                                    <Text style={config.styles.registration.doctor.labelTxt}>National ID / Passport ID
                                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                                    <View style={{ marginVertical: 10 }}>
                                        {!updateFrontID && user.identification_document && user.identification_document.front && <Image source={{ uri: user.identification_document.front }} style={config.styles.documentId} />}
                                        {updateFrontID && frontImage && frontImage.uri && <Image source={{ uri: frontImage.uri }} style={config.styles.documentId} />}
                                        <Button
                                            color={config.colors.primary}
                                            title="Choose Front Image (ID)"
                                            onPress={() => uploadFrontImage()}
                                            disabled={isDisabled}
                                        />
                                    </View>

                                    <View style={{ marginVertical: 10 }}>
                                        {!updateBackID && user.identification_document && user.identification_document.back && <Image source={{ uri: user.identification_document.back }} style={config.styles.documentId} />}
                                        {updateBackID && backImage && backImage.uri && <Image source={{ uri: backImage.uri }} style={config.styles.documentId} />}
                                        <Button
                                            color={config.colors.primary}
                                            title="Choose Back Image (ID)"
                                            onPress={() => uploadBackImage()}
                                            disabled={isDisabled}
                                        />
                                    </View>
                                </View>

                            </React.Fragment>
                            : null)
                        }

                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={config.styles.secondaryBtn} onPress={() => submitProfile()}>
                            <Text style={config.styles.btnText}>
                                {isDisabled ? 'Edit Profile' : 'Submit'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>



                <BottomSheet
                    visible={visible}
                    onBackButtonPress={() => setVisible(!visible)}
                    onBackdropPress={() => setVisible(!visible)}>
                    <View style={styles.panel}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View>
                                <Text style={styles.panelTitle}>Profile Picture</Text>
                                <Text style={styles.panelSubtitle}>Change profile photo</Text>
                            </View>

                            {user.image &&
                                <TouchableOpacity style={{ marginLeft: 55 }} onPress={() => confirmRemovePicture()}>
                                    <Icon name={"trash"} size={30} color={config.colors.danger} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 30,
                            justifyContent: 'space-evenly'
                        }}>
                            <View style={styles.uploadOptions}>
                                <TouchableOpacity onPress={() => setVisible(false)} style={[styles.icon, { borderColor: config.colors.danger, backgroundColor: config.colors.danger }]} >
                                    <Icon5 name={"trash-alt"} size={25} color={"#fff"} />
                                </TouchableOpacity>
                                <Text>Cancel</Text>
                            </View>

                            <View style={styles.uploadOptions}>
                                <TouchableOpacity style={[styles.icon, { borderColor: config.colors.purple, backgroundColor: config.colors.purple }]}>
                                    <Icon name={"photo"} size={25} color={"#fff"} onPress={() => uploadImageFromGallery()} />
                                </TouchableOpacity>
                                <Text>Gallery</Text>
                            </View>

                            <View style={styles.uploadOptions}>
                                <TouchableOpacity onPress={() => uploadImageByCamera()} style={[styles.icon, { borderColor: config.colors.primary, backgroundColor: config.colors.primary }]}>
                                    <Icon name={"camera"} size={25} color={"#fff"} />
                                </TouchableOpacity>
                                <Text>Camera</Text>
                            </View>
                        </View>
                    </View>
                </BottomSheet>
            </SafeAreaView>
            {(isLoading || isFetchingSpecialties || isFetchingFacilities) && <AppLoader />}
        </React.Fragment>
    )

}

export default ProfileScreen


const boxStyle: ViewStyle = {
    borderColor: config.colors.black,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 6,
    height: 49,
    marginBottom: 10
}

const selectBoxStyle: ViewStyle = {
    borderColor: config.colors.black,
    borderWidth: 1,
    borderRadius: 4,
}

const selectInputStyles: TextStyle = {
    color: config.colors.black,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white
    },

    header: {
        backgroundColor: config.colors.primary,
        paddingVertical: 10,
    },

    body: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: config.colors.white
    },

    userProfile: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 25,
    },

    scrollView: {
        flexGrow: 1,
        marginBottom: 50
    },

    profileTxt: {
        color: config.colors.white,
        fontSize: 20,
    },

    infoText: {
        fontSize: config.fonts.medium,
        color: config.colors.dark,
        opacity: 0.9
    },

    detailView: {
        paddingVertical: 10,
    },

    headerText: {
        fontSize: config.fonts.small,
        color: config.colors.silver,
        paddingVertical: 5,
        opacity: 1
    },

    usernameText: {
        fontSize: 20,
        fontWeight: '900',
        color: config.colors.white,
    },
    disabledInput: {
        backgroundColor: config.colors.white,
    },

    enabledInput: {
        backgroundColor: config.colors.white,
    },

    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 10,
    },

    uploadOptions: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        height: 300,
    },

    panelTitle: {
        fontSize: 22,
        height: 35,
        textAlign: 'center',
    },

    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
        textAlign: 'center',
    },

    icon: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 50,
    },

    profile_avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        alignSelf: 'center',
        backgroundColor: config.colors.white,
        borderWidth: 1,
        borderColor: "white",
    },

    camera: {
        backgroundColor: config.colors.primary,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: config.colors.white,
        position: 'absolute',
        left: 68,
        bottom: 18,
        right: 0
    },

    enabledBoxStyle: {
        ...boxStyle,
    },

    disabledBoxStyle: {
        ...boxStyle,
        opacity: 0.6,
        borderColor: config.colors.disabled,
    },

    enabledSelectBoxStyles: {
        ...selectBoxStyle,
    },

    disabledSelectBoxStyles: {
        ...selectBoxStyle,
        borderColor: config.colors.disabled,
    },

    enabledSelectTextStyle: {
        ...selectInputStyles
    },

    disabledSelectTextStyle: {
        ...selectInputStyles,
        color: config.colors.disabled,
    },

    editProfileBtn: {
        borderWidth: 0.5,
        borderColor: config.colors.silver,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },

    editProfileTxt: {
        color: config.colors.silver
    }

})