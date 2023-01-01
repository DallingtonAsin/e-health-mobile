import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as config from '../configs'
import { Avatar } from 'react-native-paper';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { Context as AuthContext } from '../context/authContext';
import { IUser } from '../interfaces';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage } from '../components/common/SharedHelper';

const ProfileScreen = ({ navigation }: {navigation: any}) => {

    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { state, updateProfile } = useContext(AuthContext);
    const [user, setUser] = useState<IUser>(state.user);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
                dob: user.dob
            }
    
            updateProfile({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });
      

        } else {
            setIsDisabled(!isDisabled);
        }
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const navigateMethod = async (message: string) => {
        displayMessage(message);
        navigation.navigate('Profile');
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

                <View style={styles.header}>

                    <Avatar.Image size={100} source={{ uri: config.images.profileImage }}>
                    </Avatar.Image>

                    <Text style={[styles.usernameText]}>{user.first_name} {user.last_name}</Text>
                    <Text style={[styles.headerText]}>
                        <Icon5 name="map-marker-alt" size={16} color={config.colors.white} />
                        <Text> {user.address} </Text>
                    </Text>

                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >

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
                        <TextInput
                            mode='outlined'
                            value={user.gender}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                            onChangeText={text => setUser(prev => ({ ...prev, gender: text }))}
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

                </ScrollView>

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
        flex: 0.35,
        backgroundColor: config.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },


    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 50,
        paddingHorizontal: 15,
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
        fontSize: config.fonts.extraLarge,
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
    }
})