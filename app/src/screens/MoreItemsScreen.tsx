import React, { useContext, useState, useMemo, useRef, useCallback } from 'react'
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import * as config from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Toast from 'react-native-simple-toast'
import { Context as AuthContext } from '../context/authContext'
import { Context as DoctorContext } from '../context/doctorContext'
import * as configs from '../configs'
import { displayMessage, getAppVersion } from '../components/common/SharedHelper'
import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetHeader } from '../components/BottomSheetHeader'
import { Divider, Switch } from 'react-native-paper'
import AppLoader from '../components/AppLoader'

const MoreItemsScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false)
    const { state, signout, updateUserState } = useContext(AuthContext)
    const { changeAutoApproveAppointmentStatus } = useContext(DoctorContext)
    const user = state.user
    const [isSwitchOn, setIsSwitchOn] = React.useState(user.auto_approve)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['25%', '70%'], [])

    const handleSnapPress = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index)
    }, [])

    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close()
    }, [])

    const listItems = [
        { id: 1, name: 'My Profile', icon: 'user-circle', isIcon5: true, action: () => gotoProfile() },
        { id: 2, name: 'Notifications', icon: 'envelope', isIcon5: true, action: () => navigation.navigate('Notifications') },
        { id: 3, name: 'Help & Support', icon: 'question-circle', isIcon5: true, action: () => navigation.navigate('ContactUs') },
        { id: 4, name: 'Terms & Conditions', icon: 'files-o', isIcon5: false, action: () => navigation.navigate('TermsConditions') },
        { id: 5, name: 'About Us', icon: 'info-circle', isIcon5: false, action: () => navigation.navigate('AboutUs') },
        { id: 6, name: 'Rate Us', icon: 'star', isIcon5: true, action: () => Toast.show('Coming soon...', Toast.LONG) },

    ]

    const getSignConf = (id: number): any => {
        return { id: id, name: 'Signout', icon: 'power-off', isIcon5: true, action: () => signout() }
    }

    if (!user.is_patient) {
        listItems[6] = { id: 7, name: 'Appointment settings', icon: 'cog', isIcon5: true, action: () => handleSnapPress(1) }
        listItems[7] = getSignConf(8)
    } else {
        listItems[6] = getSignConf(7)
    }

    const changeAutoApproveStatus = () => {
        if (!user.is_patient) {
            const message = `Are you sure you want to ${user.auto_approve ? 'disable' : 'enable'} auto approval of appointments?`
            Alert.alert(
                `Confirm change`,
                message,
                [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            setIsLoading(true);
                            changeAutoApproveAppointmentStatus({ onSuccess: onChangeStatus, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
                        }
                    },
                ],
                { cancelable: false }
            );
        }
    }

    const onChangeStatus = async (message: string) => {
        updateUserState({
            onSuccess: () => {
                setIsSwitchOn(!isSwitchOn)
                displayMessage(message)
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

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSnapPress}
                handleComponent={() => <BottomSheetHeader title='Appointment Settings' onClose={handleClosePress} />}
                style={styles.bottomSheet}
            >
                <Divider style={styles.divider} />
                <View style={styles.contentContainer}>
                    <Text style={styles.settingText}>Auto approve appointments</Text>
                    <Switch value={isSwitchOn} onValueChange={changeAutoApproveStatus} color={configs.colors.success} style={{ top: 4 }} />
                </View>
            </BottomSheet>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default MoreItemsScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: config.colors.white,
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
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
    },

    versionText: {
        fontSize: config.fonts.medium,
        color: config.colors.primary
    },

    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    bottomSheet: {
        // backgroundColor: config.colors.gray,
        // padding: 10
    },

    divider: {
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop: 20
    },

    settingText: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: '500',
        color: config.colors.primaryBlue
    }
})