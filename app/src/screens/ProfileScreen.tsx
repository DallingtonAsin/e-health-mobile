import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as config from '../configs'
import { Avatar } from 'react-native-paper';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { Context as AuthContext } from '../context/authContext';


interface IUser {
    id: number,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    email?: string,
    dob: string,
    gender: string,
}

const ProfileScreen = () => {

    const initialUser = {
        id: 12,
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        email: '',
        dob: '',
        gender: ''
    }

    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<IUser>(initialUser);
    const { state, signin } = useContext(AuthContext);

    const updateProfile = () => {

        if (!isDisabled) {
            setIsLoading(true);

            setTimeout(() => {
                setIsLoading(false);
                Toast.show(`Updating your information...`);
                setIsDisabled(!isDisabled);
            }, 3000);

        } else {
            setIsDisabled(!isDisabled);
        }
    }

    return (
        <>
            <SafeAreaView style={styles.container}>

                <View style={styles.header}>

                    <Avatar.Image size={100} source={{ uri: config.images.profileImage }}>
                    </Avatar.Image>

                    <Text style={[styles.usernameText]}>{state.user.first_name} {state.user.last_name}</Text>
                    <Text style={[styles.headerText]}>
                        <Icon5 name="map-marker-alt" size={16} color={config.colors.white} />
                        <Text> {state.user.address} </Text>
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
                            // label="First Name"
                            mode='outlined'
                            value={state.user.first_name}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Last Name</Text>
                        <TextInput
                            // label="Last Name"
                            mode='outlined'
                            value={state.user.last_name}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>


                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Contact Number</Text>
                        <TextInput
                            // label="First Name"
                            mode='outlined'
                            value={state.user.phone_number}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Address</Text>
                        <TextInput
                            // label="Address"
                            mode='outlined'
                            value={state.user.address}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Email</Text>
                        <TextInput
                            // label="Email"
                            mode='outlined'
                            value={state.user.email}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Gender</Text>
                        <TextInput
                            // label="Gender"
                            mode='outlined'
                            value={state.user.gender}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

               
                    <View style={styles.detailView}>
                        <Text style={styles.infoText}>Date of Birth</Text>
                        <TextInput
                            // label="Date of Birth"
                            mode='outlined'
                            value={state.user.dob}
                            disabled={isDisabled}
                            activeOutlineColor={config.colors.primary}
                            style={isDisabled ? styles.disabledInput : styles.enabledInput}
                        />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={config.styles.secondaryBtn} onPress={() => updateProfile()}>
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
        fontSize: 18,
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