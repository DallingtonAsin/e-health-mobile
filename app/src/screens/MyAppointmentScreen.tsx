import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import * as config from '../configs'

interface MyAppointmentInfo {
    id: number,
    drImage: string,
    drName: string,
    city: string,
    address: string,
    consultationReason: string,
    date: string,
    time: string,
    status: boolean,
    statusText: string,
    type: string,
}
const MyAppointmentScreen = () => {

    const myappointmentInfo = [
        { id: 1, drImage: 'https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg', drName: 'Dr. Grace Kaisa', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: true, statusText: 'Completed', type: 'Prescription' },
        { id: 2, drImage: 'https://static2.bigstockphoto.com/4/7/3/large1500/374246794.jpg', drName: 'Dr. Dallington A', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: false, statusText: 'Pending', type: 'Video Call' },
        { id: 3, drImage: 'https://www.seekpng.com/png/full/13-132502_alligator-black-male-doctor-png.png', drName: 'Dr. Herman', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: false, statusText: 'Pending', type: 'Audio Call' },
        { id: 4, drImage: 'https://thumbs.dreamstime.com/b/portrait-positive-black-doctor-holding-medical-chart-male-over-white-background-178499631.jpg', drName: 'Dr. Ceasar', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: true, statusText: 'Completed', type: 'Prescription' },
        { id: 5, drImage: 'https://pngimg.com/uploads/doctor/doctor_PNG15957.png', drName: 'Hariharan G', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: false, statusText: 'Pending', type: 'Audio Call' },
        { id: 6, drImage: 'https://st.depositphotos.com/1770836/1357/i/950/depositphotos_13576597-stock-photo-female-doctor-or-nurse.jpg', drName: 'Dr. Jude', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: true, statusText: 'Completed', type: 'Audio Call' },
        { id: 7, drImage: 'https://i.pinimg.com/originals/5b/a1/a3/5ba1a398ac0aa7fe01480166fd2b818f.png', drName: 'Dr. Agaba', city: 'Karaikudi', address: 'Ntinda - Kampala', consultationReason: 'Skin related problem', date: '2022-12-04', time: '7:30 PM', status: true, statusText: 'Completed', type: 'Prescription' },
    ];

    const [appointmentInfo, setAppointmentInfo] = useState<MyAppointmentInfo[]>();

    useEffect(() => {
        setAppointmentInfo(myappointmentInfo);
    }, [])

    const renderItem = ({ item }: { item: MyAppointmentInfo }) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.avatarView}>
                <Avatar.Image size={80} source={{ uri: item.drImage }} />
                {/* <Avatar.Text size={75} label={`A`} /> */}

            </View>
            <View style={styles.main}>

                <Text style={styles.drNameTxt}>{item.drName}</Text>
                <Text style={styles.info}>{item.address}</Text>
                <Text style={styles.info}>Reason for consultation: <Text style={[styles.info]}>{item.consultationReason}</Text></Text>
                 <View style={styles.dateView}>
                    <Text style={[styles.info]}>Date: {item.date}</Text>
                    <Text style={[styles.info]}>Time: {item.time}</Text>
                 </View>

                <View style={styles.typeView}>
                    <TouchableOpacity style={styles.type}>
                        <Text style={styles.typeTxt}>{item.type}</Text>
                    </TouchableOpacity>
                    <View style={styles.statusView}>
                        <Text style={styles.info}>Status:</Text>
                        <Text style={item.status ? styles.completedTxt : styles.pendingTxt}>{item.statusText}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <FlatList
                    data={appointmentInfo}
                    renderItem={renderItem}
                    keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    )
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

    drNameTxt: {
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

    completedTxt: {
        backgroundColor: config.colors.confirmedBg,
        color: config.colors.confirmedColor,
        fontWeight: '600',
        marginLeft: 5,
        borderRadius:5,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding:5
    },

    pendingTxt: {
        backgroundColor: config.colors.pendingBg,
        color: config.colors.pendingColor,
        fontWeight: '600',
        marginLeft: 5,
        borderRadius:5,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding:5
    }


})
