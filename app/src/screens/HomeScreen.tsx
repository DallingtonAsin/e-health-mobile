import React, { useState, useContext } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable
} from 'react-native';
import * as configs from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { displayMessage, getGreeting } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { Context as DoctorContext } from '../context/doctorContext';
import Avatar from '../components/Avatar';
import { useSelector } from 'react-redux';
import { selectNotifications } from "../redux/reducers/notificationSlice";
import { Notification } from '../interfaces';
import AppLoader from '../components/AppLoader';

const HomeScreen = ({ navigation }: { navigation: any }) => {

    const { state, updateUserState } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { isVerified } = useContext(DoctorContext);
    const notifications = useSelector(selectNotifications);

    const user = state.user;
    const iconSize = 40;

    const unreadCount = notifications.filter((notification: Notification) => !notification.read).length;

    const navigateScreen = (screen: string) => {
        if (!user.is_patient) {
            if (user.is_registered) {
                if (user.is_verified) {
                    navigation.navigate(screen)
                } else {
                    setIsLoading(true);
                    isVerified({ screen: screen, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
                }
            } else {
                navigation.navigate('CompleteRegistration')
            }
        } else {
            navigation.navigate(screen)
        }
    }

    const onSuccess = async (screen: string) => {
        updateUserState({ onSuccess: navigation.navigate('SignedInStack', { screen: screen }) });
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
                                <Avatar size={90} borderRadius={75} source={configs.images.logo} resizeMode={'contain'} isURL={false} />
                            </Pressable>

                            <TouchableOpacity style={styles.notificationView} onPress={() => navigateScreen('Notifications')}>
                                <Icon name="bell" size={25} color={configs.colors.white} style={styles.notificationIcon} />
                                {unreadCount > 0 &&
                                    <View style={[configs.styles.supCount, { right: 2 }]}>
                                        <Text style={{ color: configs.colors.white, fontSize: 12 }}>{unreadCount}</Text>
                                    </View>}
                            </TouchableOpacity>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', top: 30 }}>
                            <View style={{ left: 20 }}>
                                {user.is_patient && <Text style={styles.greeting}>{getGreeting()}, {user.first_name}</Text>}
                                {!user.is_patient && <Text style={styles.greeting}>{getGreeting()}, {`Dr.`} {user.first_name}</Text>}
                                <Text style={styles.amazing}>Today is amazing!</Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.body}>
                        <Text style={styles.title}>Quick Actions</Text>

                        <View style={styles.cardContainer}>
                            {user.is_patient &&
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('SpecialitiesList')}>
                                    <Icon5 name="user-md" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Call Doctor</Text>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen('MyAppointments')}>
                                <Icon5 name="calendar-alt" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>My Appointments</Text>
                            </TouchableOpacity>

                            {!user.is_patient &&
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('DoctorsCalendar')}>
                                    <Icon name="calendar" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>My Calendar</Text>
                                </TouchableOpacity>
                            }

                        </View>

                        {user.is_patient &&
                            <View style={styles.cardContainer}>
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('SpecialityCategories')}>
                                    <Icon5 name="stethoscope" size={iconSize} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Specialties</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.card} onPress={() => navigateScreen('MedicalHistory')}>
                                    <Icon name="hospital-o" size={iconSize * 0.8} color={configs.colors.primary} />
                                    <Text style={styles.subtitle}>Medical History</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen(`ContactUs`)}>
                                <Icon5 name="question-circle" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Help</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => navigateScreen(`MoreTabScreen`)}>
                                <Icon name="gear" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Settings</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    header: {
        backgroundColor: configs.colors.primary,
        flex: 2,
    },

    body: {
        backgroundColor: '#f1f5ff',
        flex: 4,
    },

    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 35,

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

    title: {
        fontSize: 17,
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        marginTop: 20,
        textTransform: 'capitalize',
        color: configs.colors.darkBlue,
        opacity: 0.7,
    },

    subtitle: {
        fontSize: configs.fonts.normal,
        fontWeight: 'bold',
        top: 10,
        textAlign: 'center',
        color: configs.colors.darkBlue
    },

    greeting: {
        fontSize: 24,
        textAlign: 'left',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textTransform: 'capitalize',
        color: configs.colors.white,
        opacity: 0.8
    },

    amazing: {
        fontSize: 18,
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
        left: 20,
    },
});