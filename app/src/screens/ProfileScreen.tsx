import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as config from '../configs'
import { Avatar as AvatarRP, IconButton } from 'react-native-paper';
import Avatar from '../components/Avatar';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { Context as AppContext } from '../context/appContext';
import { Context as AuthContext } from '../context/authContext';
import { IUser } from '../interfaces';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, getUserInitials, getJsonObjByValue } from '../components/common/SharedHelper';
import { SelectList } from 'react-native-dropdown-select-list';
import ImagePicker from 'react-native-image-crop-picker';
import { UIActivityIndicator } from 'react-native-indicators';
import { BottomSheet } from 'react-native-btr';
var mime = require('mime-types');


const ProfileScreen = ({ navigation }: { navigation: any }) => {

    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { state, updateUserState } = useContext(AuthContext);
    const { updateProfile, updateProfileImage, deleteProfileImage } = useContext(AppContext);

    const [user, setUser] = useState<IUser>(state.user);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ];

    const submitProfile = () => {

        if (!isDisabled) {

            if (!user.first_name) {
                Toast.show('Enter your first name', Toast.LONG);
                return;
            }

            if (!user.last_name) {
                Toast.show('Enter your last name', Toast.LONG);
                return;
            }

            if (!user.address) {
                Toast.show('Enter your address', Toast.LONG);
                return;
            }

            if (!user.gender) {
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
                gender: user.gender,
                dob: user.dob,
                is_patient: user.is_patient
            }

            updateProfile({ payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });


        } else {
            setIsDisabled(!isDisabled);
        }
    }

    const onSuccess = async (message: string) => {
        updateUserState({
            onSuccess: () => {
                displayMessage(message);
                navigation.navigate('SignedInStack', { screen: 'Profile' });
                setIsDisabled(true);
            }
        });
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

    const takePhotoFromCamera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            compressImageQuality: 0.7,
        }).then(async image => {
            await submitProfilePicture(image);
        });
    }

    const choosePhotoFromLibrary = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(async (image) => {
            await submitProfilePicture(image);
        });
    }

    const submitProfilePicture = async (image: any) => {
        try {

            const imagePath = image.path;
            const mimeType = image.mime;
            const fileExtension = mime.extension(mimeType);
            let formData = new FormData();

            const user_obj = {
                id: user.id,
                is_patient: user.is_patient
            }

            const imageData = {
                uri: imagePath,
                type: mimeType,
                size: image.size,
                extension: fileExtension,
                name: 'profile_pic',
            }

            formData.append('id', user.id);
            formData.append('extension', fileExtension);
            formData.append('image', imageData);

            setIsUpdatingImage(true);

            updateProfileImage({ user: user_obj, payload: formData, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: closeLoader });

        } catch (err: any) {
            Toast.show(err.message, Toast.LONG);
        }
    }

    const closeLoader = () => {
        setIsUpdatingImage(false);
        setVisible(false);
    }

    const deleteProfilePicture = async () => {
        try {

            const user_obj = {
                id: user.id,
                is_patient: user.is_patient
            }
            setIsUpdatingImage(true);

            deleteProfileImage({ user: user_obj, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: closeLoader });

        } catch (err: any) {
            Toast.show(err.message, Toast.LONG);
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
        );
    }

    return (
        <>
            <SafeAreaView style={styles.container}>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.header}>
                        {
                            !isUpdatingImage ?
                                <View style={{ position: 'relative' }}>
                                    {state.user.image
                                        ? <Avatar size={90} source={state.user.image} />
                                        : <AvatarRP.Text size={80} label={getUserInitials(`${state.user.first_name} ${state.user.last_name}`)} style={config.styles.userAvatar} />
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

                        <Text style={[styles.usernameText]}>{!user.is_patient && user.title} {user.first_name} {user.last_name}</Text>
                        <Text style={[styles.headerText]}>
                            {user.is_patient && <> <Icon5 name="map-marker-alt" size={16} color={config.colors.white} /><Text> {user.address} </Text></>}
                            {!user.is_patient && <> <Icon5 name="user-md" size={18} color={config.colors.white} /><Text> {user.profession} </Text></>}
                        </Text>

                    </View>

                    <View style={styles.body}>

                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>First Name</Text>
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
                            <Text style={styles.infoText}>Last Name</Text>
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
                            <Text style={styles.infoText}>Address</Text>
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
                            <Text style={styles.infoText}>Email</Text>
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
                            <Text style={styles.infoText}>Gender</Text>
                            <SelectList
                                setSelected={(val: string) => setUser(prev => ({ ...prev, gender: val }))}
                                data={genderOptions}
                                save="value"
                                search={false}
                                defaultOption={getJsonObjByValue(genderOptions, user.gender)}
                                placeholder={"Select Gender"}
                                inputStyles={{ color: config.colors.black }}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                            />
                        </View>


                        <View style={styles.detailView}>
                            <Text style={styles.infoText}>Date of Birth</Text>

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

                        <View style={styles.footer}>
                            <TouchableOpacity style={config.styles.secondaryBtn} onPress={() => submitProfile()}>
                                <Text style={config.styles.btnText}>
                                    {isDisabled ? 'Edit Profile' : 'Submit'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>

                <BottomSheet
                    visible={visible}
                    onBackButtonPress={() => setVisible(!visible)}
                    onBackdropPress={() => setVisible(!visible)}
                >
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
                                    <Icon name={"photo"} size={25} color={"#fff"} onPress={() => choosePhotoFromLibrary()} />
                                </TouchableOpacity>
                                <Text>Gallery</Text>
                            </View>

                            <View style={styles.uploadOptions}>
                                <TouchableOpacity onPress={() => takePhotoFromCamera()} style={[styles.icon, { borderColor: config.colors.primary, backgroundColor: config.colors.primary }]}>
                                    <Icon name={"camera"} size={25} color={"#fff"} />
                                </TouchableOpacity>
                                <Text>Camera</Text>
                            </View>

                        </View>

                    </View>
                </BottomSheet>

            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )

}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flex: 2,
        backgroundColor: config.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    body: {
        flex: 4,
        paddingHorizontal: 15,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 25,

    },

    scrollView: {
        flex: 1,
        backgroundColor: config.colors.white,
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
        fontSize: 16,
        color: config.colors.white,
        paddingVertical: 5
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
        flex: 1,
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 20,
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
        left: 58,
        bottom: 10,
        right: 0
    },
});