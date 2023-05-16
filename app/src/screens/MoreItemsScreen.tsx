import React, { useState, useContext } from 'react'
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import * as config from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Toast from 'react-native-simple-toast'
import { Context as AuthContext } from '../context/authContext'
import { Context as DoctorContext } from '../context/doctorContext'
import * as configs from '../configs'
import { displayMessage, getAppVersion } from '../components/common/SharedHelper'
import AppLoader from '../components/AppLoader'


const MoreItemsScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const { updateOnlineStatus } = useContext(DoctorContext)
    const { state, signout, updateUserState } = useContext(AuthContext)
    const user = state.user

    const listItems = [
        { id: 1, name: 'My Profile', icon: 'user-circle', isIcon5: true, action: () => gotoProfile() },
        { id: 2, name: 'Notifications', icon: 'envelope', isIcon5: true, action: () => navigation.navigate('Notifications') },
        { id: 3, name: 'Help & Support', icon: 'question-circle', isIcon5: true, action: () => navigation.navigate('ContactUs') },
        { id: 4, name: 'Terms & Conditions', icon: 'files-o', isIcon5: false, action: () => navigation.navigate('TermsConditions') },
        { id: 5, name: 'About Us', icon: 'info-circle', isIcon5: false, action: () => navigation.navigate('AboutUs') },
        { id: 6, name: 'Rate Us', icon: 'star', isIcon5: true, action: () => Toast.show('Coming soon...', Toast.LONG) },
        { id: 7, name: 'Signout', icon: 'power-off', isIcon5: true, action: () => signout() },
    ]

    if (!user.is_patient) {
        listItems[7] = { id: 8, name: 'Change online status', icon: 'refresh', isIcon5: false, action: () => changeOnlineStatus() }
    }

    const changeOnlineStatus = () => {
        if (!user.is_patient) {
            const message = `Are you sure you want to go ${user.is_online ? 'offline' : 'online'}?`
            Alert.alert(
                `Confirm status`,
                message,
                [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            setIsLoading(true);
                            updateOnlineStatus({ onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
                        }
                    },
                ],
                { cancelable: false }
            );
        }
    }

    const onSuccess = async (message: string) => {
        updateUserState({
            onSuccess: () => {
                displayMessage(message)
                navigation.navigate('SignedInStack', { screen: 'Home' })
            }
        })
    }

    const gotoProfile = () => {
        if (!user.is_patient) {
            if (!user.is_registered) {
                navigation.navigate('CompleteRegistration')
            } else {
                navigation.navigate('Profile')
            }
        } else {
            navigation.navigate('Profile')
        }
    }

    const Item = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.item} onPress={item.action}>
            {item.isIcon5
                ? <Icon5 name={item.icon} size={20} color={configs.colors.primary} />
                : <Icon name={item.icon} size={20} color={configs.colors.primary} />
            }
            <Text style={styles.itemTitle}>{item.name}</Text>
        </TouchableOpacity>
    )

    const renderItem = ({ item }: { item: any }) => (
        <Item item={item} />
    )

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <View style={styles.body}>
                    <FlatList
                        data={listItems}
                        renderItem={renderItem}
                        keyExtractor={(item: any, index: number) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                        ListFooterComponent={<View style={{ height: 40 }} />}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.versionText}>Current Version: {getAppVersion()}</Text>
                </View>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default MoreItemsScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    body: {
        flex: 4,
        backgroundColor: config.colors.white,
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 20,
    },

    itemTitle: {
        color: config.colors.black,
        fontSize: configs.fonts.medium,
        left: 12,
    },

    item: {
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        padding: 20,
        borderTopColor: configs.colors.silver,
        borderBottomColor: configs.colors.silver,
        borderWidth: 0.5,
    },

    versionText: {
        fontSize: config.fonts.medium,
        color: config.colors.primary
    }
})