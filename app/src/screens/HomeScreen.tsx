import React, { useContext, useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import * as configs from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import { Avatar as AvatarRP } from 'react-native-paper';
import { displayMessage, getGreeting } from '../components/common/SharedHelper';
import { Context as AppContext } from '../context/appContext';
import { getUserInitials } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import Avatar from '../components/Avatar';


const HomeScreen = ({ navigation }: { navigation: any }) => {

    const { state, getNotifications } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadNotifications, setUnreadNotificationsCount] = useState<number>(0);

    const user = state.user;
    const iconSize = 40;

    useEffect(() => {
        getNotifications({ is_patient: user.is_patient, onSuccess: populateNotifications, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });
    }, []);

    const populateNotifications = (data: any) => {
        setUnreadNotificationsCount(data.stats.unreadCount);
    }

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar backgroundColor={configs.colors.primary} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainerStyle}>

                <View style={styles.header}>

                    <View style={styles.headerImageSection}>
                        <TouchableOpacity style={styles.image} onPress={() => navigation.navigate('Profile')}>
                            {user.image
                                ? <Avatar size={80} source={user.image} />
                                : <AvatarRP.Text size={80} label={getUserInitials(`${user.first_name} ${user.last_name}`)} style={configs.styles.userAvatar} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.notificationView} onPress={() => navigation.navigate('Notifications')}>
                            <Icon name="bell" size={25} color={configs.colors.white} style={styles.notificationIcon} />
                            { unreadNotifications > 0 &&
                                <View style={[configs.styles.supCount, { right: 2 }]}>
                                    <Text style={{ color: configs.colors.white, fontSize: 12 }}>{unreadNotifications}</Text>
                                </View> }
                        </TouchableOpacity>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', top: 30 }}>
                        <View style={{ left: 20 }}>
                            <Text style={styles.greeting}>{getGreeting()} {!user.is_patient && user.title} {user.first_name}</Text>
                            <Text style={styles.amazing}>Today is amazing!</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.body}>
                    <Text style={styles.title}>Quick Actions</Text>

                    <View style={styles.cardContainer}>
                        {user.is_patient &&
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SpecialityCategories')}>
                                <Icon5 name="user-md" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Doctors</Text>
                            </TouchableOpacity>
                        }

                        {!user.is_patient &&
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DoctorsCalendar')}>
                                <Icon5 name="clock" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>My Calendar</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MyAppointments')}>
                            <Icon5 name="calendar-alt" size={iconSize} color={configs.colors.primary} />
                            <Text style={styles.subtitle}>My Appointments</Text>
                        </TouchableOpacity>

                    </View>

                    {user.is_patient &&
                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pharmacy')}>
                                <Icon5 name="pills" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Pharmacy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MedicalHistory')}>
                                <Icon name="hospital-o" size={iconSize * 0.8} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Medical History</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {user.is_patient &&
                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`ContactUs`)}>
                                <Icon5 name="question-circle" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Help</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => Toast.show(`coming soon...`, Toast.LONG)}>
                                <Icon name="gear" size={iconSize} color={configs.colors.primary} />
                                <Text style={styles.subtitle}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>

            </ScrollView>
        </SafeAreaView>
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
        backgroundColor: configs.colors.white,
        flex: 4,
    },

    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 35,
    },

    card: {
        flex: 1,
        borderRadius: 100 / 20,
        borderWidth: 0.5,
        borderColor: 'gray',
        marginHorizontal: 5,
        marginVertical: 6,
        paddingVertical: 25,
        paddingHorizontal: 5,
        alignItems: 'center',
        textShadowColor: 'gray',
        backgroundColor: configs.colors.white,
        shadowOffset: {
            height: 4,
            width: 4
        },
    },

    title: {
        fontSize: 17,
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        marginTop: 20,
        textTransform: 'capitalize',
        color: configs.colors.dark,
        opacity: 0.7,
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

    subtitle: {
        fontSize: configs.fonts.normal,
        fontWeight: 'bold',
        top: 10,
        textAlign: 'center'
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