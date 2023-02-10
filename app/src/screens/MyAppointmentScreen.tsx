import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';
import * as config from '../configs';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { IUser, MyAppointmentInfo } from '../interfaces';
import { Context as AuthContext } from '../context/authContext';
import { displayMessage } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';


const MyAppointmentScreen = ({ navigation }: { navigation: any }) => {

    const [pendingAppointments, setPendingAppointments] = useState<MyAppointmentInfo[]>();
    const [completedAppiontments, setCompletedAppointments] = useState<MyAppointmentInfo[]>();
    const [cancelledAppointments, setCancelledAppointments] = useState<MyAppointmentInfo[]>();

    const [isPendingLoading, setIsPendingLoading] = useState(true);
    const [isCompletedLoading, setIsCompletedLoading] = useState(true);
    const [isCancelledLoading, setIsCancelledLoading] = useState(true);

    const { state, getMyAppointments } = useContext(AuthContext);
    const [user, setUser] = useState<IUser>(state.user);

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'pending', title: 'Pending' },
        { key: 'completed', title: 'Completed' },
        { key: 'cancelled', title: 'Cancelled' }
    ]);


    useEffect(() => {
        getMyAppointments({ payload: { patient_id: user.id, path: 'pending' }, onSuccess: setPendingAppoinments, onFailure: displayMessage, onCompletion: () => setIsPendingLoading(false) });
        getMyAppointments({ payload: { patient_id: user.id, path: 'completed' }, onSuccess: setCompletedAppoinments, onFailure: displayMessage, onCompletion: () => setIsCompletedLoading(false) });
        getMyAppointments({ payload: { patient_id: user.id, path: 'cancelled' }, onSuccess: setCancelledAppoinments, onFailure: displayMessage, onCompletion: () => setIsCancelledLoading(false) });
    }, []);

    const setPendingAppoinments = (data: MyAppointmentInfo[]) => {
        setPendingAppointments(data);
    }

    const setCompletedAppoinments = (data: MyAppointmentInfo[]) => {
        setCompletedAppointments(data);
    }

    const setCancelledAppoinments = (data: MyAppointmentInfo[]) => {
        setCancelledAppointments(data);
    }

    const EmptyListComponent = ({ message }: { message: string }) => (
        <View style={config.styles.emptyViewContainer}>
            <Icon5 name="calendar-alt" size={60} />
            <Text style={config.styles.noInfoText}>{message}</Text>
        </View>
    );

    const PendingAppointmentsScreen = () => (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <FlatList
                    data={pendingAppointments}
                    renderItem={renderItem}
                    keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyListComponent message="No Pending Appointments" />}
                />
            </View>
        </SafeAreaView>
    );

    const CancelledAppointmentsScreen = () => (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <FlatList
                    data={cancelledAppointments}
                    renderItem={renderItem}
                    keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyListComponent message="No Cancelled Appointments" />}
                />
            </View>
        </SafeAreaView>
    );

    const CompletedAppointmentsScreen = () => (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <FlatList
                    data={completedAppiontments}
                    renderItem={renderItem}
                    keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyListComponent message="No Completed Appointments" />}
                />
            </View>
        </SafeAreaView>
    );

    const renderScene = SceneMap({
        pending: PendingAppointmentsScreen,
        cancelled: CancelledAppointmentsScreen,
        completed: CompletedAppointmentsScreen
    });

    const renderItem = ({ item }: { item: MyAppointmentInfo }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AppointmentDetails', { appointmentInfo: item })}>
            <View style={styles.avatarView}>
                <Avatar.Image size={80} source={{ uri: item.doctor.image }} />
            </View>
            <View style={styles.main}>

                <Text style={styles.doctorTxt}>{item.doctor.title} {item.doctor.first_name} {item.doctor.last_name}</Text>
                <Text style={styles.info}>Reason: <Text style={[styles.info]}>{item.symptoms}</Text></Text>
                <View style={styles.dateView}>
                    <Text style={[styles.info]}>Date: {item.appointment_date}</Text>
                    <Text style={[styles.info]}>Time: {item.appointment_time}</Text>
                </View>

                <View style={styles.typeView}>
                    <TouchableOpacity style={styles.type}>
                        <Text style={styles.typeTxt}>{item.appointment_type}</Text>
                    </TouchableOpacity>
                    <View style={styles.statusView}>
                        <Text style={styles.info}>Status:</Text>
                        <Text style={[styles.status, item.status === 'Completed' && config.styles.completedTxt,  item.status === 'Cancelled' && config.styles.cancelledTxt,  item.status === 'Pending' && config.styles.pendingTxt]}>{item.status}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: config.colors.black, fontSize: config.fonts.large, fontWeight: '400' }}>
                    {route.title}
                </Text>
            )}
            indicatorStyle={{ backgroundColor: config.colors.primary }}
            style={{ backgroundColor: config.colors.white }}
        />
    );

    if (isPendingLoading || isCompletedLoading || isCancelledLoading) {
        return (
            <AppLoader bgColor={config.colors.white} />
        )
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

export default MyAppointmentScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
    },

    avatarView: {
        flex: 1,
        justifyContent: 'center'
    },

    main: {
        flex: 3,
        paddingHorizontal: 20,
        paddingBottom: 6,
        borderBottomColor: config.colors.silver,
        borderBottomWidth: 1,

    },

    typeView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },

    type: {
        backgroundColor: config.colors.primary,
        padding: 5,
        borderRadius: 4,
    },

    typeTxt: {
        color: config.colors.white
    },

    info: {
        fontSize: config.fonts.medium,
    },

    doctorTxt: {
        fontSize: 16,
        fontWeight: '500',
        color: config.colors.dark
    },

    statusView: {
        flexDirection: 'row',
    },

    dateView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    status: {
        fontWeight: '600',
        marginLeft: 5,
        borderRadius: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 5
    },

   
});