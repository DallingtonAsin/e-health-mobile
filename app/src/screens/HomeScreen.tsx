import React, { useState, useContext, Fragment } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Pressable, Alert } from 'react-native'
import * as configs from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { displayMessage, getGreeting } from '../components/common/SharedHelper'
import { Context as AuthContext } from '../context/authContext'
import { Context as DoctorContext } from '../context/doctorContext'
import Avatar from '../components/Avatar'
import { useSelector } from 'react-redux'
import { selectUnreadNotifications } from "../redux/reducers/notificationSlice"
import AppLoader from '../components/AppLoader'
import { RootState } from '../redux/store'
import { Switch } from 'react-native-paper'
import TopupCard from './Home/TopupCard'

const HomeScreen = ({ navigation }: { navigation: any }) => {

    const { state, updateUserState } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const { isVerified, updateOnlineStatus } = useContext(DoctorContext)
    const unreadNotifications = useSelector((state: RootState) => selectUnreadNotifications(state));
    const loading = useSelector((state: RootState) => state.notifications.loading)
    const user = state.user
    const [isSwitchOn, setIsSwitchOn] = React.useState(user.is_online)
    const iconSize = 40
    const is_patient = Boolean(user.is_patient)

    const unreadCount = unreadNotifications.length

    const navigateScreen = (screen: string) => {
        if (!is_patient) {
            if (user.is_registered) {
                if (user.is_verified) {
                    navigation.navigate(screen)
                } else {
                    setIsLoading(true)
                    isVerified({ screen: screen, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
                }
            } else {
                navigation.navigate('CompleteRegistration')
            }
        } else {
            navigation.navigate(screen)
        }
    }

    const onSuccess = async (screen: string) => {
        updateUserState({ onSuccess: navigation.navigate('SignedInStack', { screen: screen }) })
    }

    const changeOnlineStatus = () => {
        if (!is_patient) {
            const message = `Are you sure you want to go ${user.is_online ? 'offline' : 'online'}?`
            Alert.alert(
                `Confirm change`,
                message,
                [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            setIsLoading(true);
                            updateOnlineStatus({ onSuccess: onChangeStatusSuccess, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
                        }
                    },
                ],
                { cancelable: false }
            );
        }
    }

    const onChangeStatusSuccess = async (message: string) => {
        updateUserState({
            onSuccess: () => {
                setIsSwitchOn(!isSwitchOn)
                displayMessage(message)
            }
        })
    }
    const comingSoon = () => {
        displayMessage('coming soon...')
    }

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={configs.colors.primary} />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainerStyle}>

                    <View style={styles.header}>
                        <View style={styles.headerImageSection}>
                            <Pressable style={styles.image} onPress={() => navigateScreen('Profile')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Avatar size={80} borderRadius={75} source={configs.images.logo} resizeMode={'contain'} isURL={false} />
                                    <View style={{ top: 15 }}>
                                        <View style={{ left: 10 }}>
                                            <Text style={styles.greeting}>{getGreeting()} {user.first_name}</Text>
                                            {is_patient && <Text style={styles.amazing}>Keep Healthy</Text>}
                                            {!is_patient && <Text style={styles.amazing}>Status:
                                                {!is_patient && (user.is_registered ? (user.is_verified === 0 && <Text style={styles.underReviewTxt}> Profile under review</Text>) : null)}
                                                {!is_patient && (user.is_registered ? (user.is_verified === 1 && <Text style={user.is_online ? configs.styles.online : configs.styles.offline}> {user.is_online ? 'online' : 'offline'}</Text>) : null)}
                                            </Text>}
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                            <TouchableOpacity style={styles.notificationView} onPress={() => navigateScreen('Notifications')}>
                                <Icon name="bell" size={25} color={configs.colors.white} style={styles.notificationIcon} />
                                {unreadCount > 0 &&
                                    <View style={[configs.styles.supCount, { right: 2, backgroundColor: configs.colors.green, borderWidth: 0.6, borderColor: configs.colors.green }]}>
                                        <Text style={{ color: configs.colors.white, fontSize: 12, fontWeight: 'bold' }}>{unreadCount}</Text>
                                    </View>}
                            </TouchableOpacity>
                        </View>

                        <TopupCard balance={user.balance} isPatient={is_patient} />

                        {!is_patient && <View style={{ flexDirection: 'row', alignItems: 'flex-end', left: 15, top: 10 }}>
                            <Switch value={isSwitchOn} onValueChange={changeOnlineStatus} color={configs.colors.success} style={{ top: 4 }} />
                            <Text style={{ color: configs.colors.silver }}>Switch to {isSwitchOn ? 'offline' : 'online'} mode</Text>
                        </View>}



                    </View>


                    <View style={styles.body}>

                        <View style={styles.ratingView}>
                            {!is_patient && <Text style={styles.ratingText}> <Icon5 name="star" size={20} color={configs.colors.orange} /> {user.rating ? user.rating : 0}/5</Text>}
                        </View>

                        <View style={styles.cardContainer}>
                            {is_patient && <Fragment>
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('MedicalSpecialitiesList')}>
                                    <Icon5 name="user-md" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Call Doctor</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('SpecialityCategories')}>
                                    <Icon5 name="stethoscope" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Specialties</Text>
                                </TouchableOpacity>
                            </Fragment>

                            }

                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen('MyAppointments')}>
                                <Icon5 name="calendar-alt" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Appointments</Text>
                            </TouchableOpacity>

                            {!is_patient &&
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('DoctorsCalendar')}>
                                    <Icon name="calendar" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>My Calendar</Text>
                                </TouchableOpacity>
                            }

                            {!is_patient &&
                                <TouchableOpacity style={styles.card} onPress={comingSoon}>
                                    <Icon5 name="dollar-sign" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Earnings</Text>
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen('MedicalHistory')}>
                                <Icon name="hospital-o" size={iconSize * 0.8} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Medical History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={comingSoon}>
                                <Icon5 name={!is_patient ? "wallet" : "dollar-sign"} size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Transactions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen(`MoreTabScreen`)}>
                                <Icon name="gear" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                        {!is_patient && (!user.is_registered ? <Text style={styles.underReviewTxt}>In order to get started, Please complete your profile</Text> : null)}
                        {!is_patient && (user.is_registered ? (!user.is_verified && <Text style={styles.underReviewTxt}>Your profile is currently undergoing  review</Text>) : null)}

                    </View>
                </ScrollView>
            </SafeAreaView>
            {(isLoading || loading) && <AppLoader />}
        </React.Fragment>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.primary,
    },

    scroll: {
        flex: 1,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    header: {
        flex: 1,
        top: 5,
        backgroundColor: configs.colors.primary,
    },

    body: {
        backgroundColor: '#ffffff',
        flex: 4,
    },

    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 15,

    },

    card: {
        flex: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 6,
        paddingVertical: 25,
        paddingHorizontal: 5,
        alignItems: 'center',
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        backgroundColor: configs.colors.white,
        padding: 20,
        elevation: 8
    },

    ratingView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 15,
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centerText: {
        fontSize: 17,
        textAlign: 'center',
        fontStyle: 'normal',
        textTransform: 'capitalize',
        color: configs.colors.darkBlue,
        opacity: 0.7,
    },

    ratingText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: configs.colors.darkBlue,
        opacity: 0.7,
        right: 8
    },

    subtitle: {
        fontSize: configs.fonts.normal,
        // // fontWeight: 'bold',
        top: 10,
        textAlign: 'center',
        color: configs.colors.darkBlue
    },

    greeting: {
        fontSize: 18,
        textAlign: 'left',
        fontStyle: 'normal',
        textTransform: 'capitalize',
        color: configs.colors.white,
        opacity: 0.8
    },

    amazing: {
        fontSize: configs.fonts.extraLarge,
        color: configs.colors.white,
        fontWeight: '500',
        opacity: 0.9
    },

    docStatus: {
        fontSize: configs.fonts.small,
        color: configs.colors.white,
        fontWeight: '300',
    },

    tinyLogo: {
        width: 220,
        height: 200,
        resizeMode: 'stretch',
    },

    imageContainer: {
        marginVertical: 0,
        alignSelf: 'center'
    },

    notificationView: {
        marginVertical: 15,
        right: 10,
    },

    notificationIcon: {
        right: 10,
        marginTop: 5,
    },

    headerImageSection: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    image: {
        top: 10,
        left: 20
    },

    underReviewTxt: {
        textAlign: 'center',
        color: configs.colors.orange,
        fontWeight: '500',
        marginTop: 20,
        fontSize: configs.fonts.normal
    }
})
