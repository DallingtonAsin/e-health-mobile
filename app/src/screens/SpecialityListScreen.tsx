import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as configs from '../configs';
import { Avatar } from 'react-native-paper';

interface SpecialityDetail {
    id: number,
    name: string,
    phoneNumber: string,
    course: string,
    title: string,
    experience: string,
    languages: string,
    src: string,
    fee: number,
}

const SpecialityListScreen = ({ navigation }: { navigation: any }) => {

    const specialities = [
        { id: 1, name: 'Dr. Anthony Luna', phoneNumber: '+256780225155', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda`, src: 'https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg', fee: 800 },
        { id: 2, name: 'Dr. Grace Kaisa', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Dentist', experience: `3 Yrs`, languages: `English, Luganda`, src: 'https://thumbs.dreamstime.com/b/smiling-female-doctor-holding-medical-records-lab-coat-her-office-clipboard-looking-camera-56673035.jpg', fee: 330 },
        { id: 3, name: 'Dr. Herman Keid', phoneNumber: '0774014727', course: 'MBBS, DNB', title: 'Surgeon', experience: `1 Yr`, languages: `English, Luo, Luganda`, src: 'https://t4.ftcdn.net/jpg/03/16/76/11/360_F_316761139_yVmLRT0AVwpZwOTgpmfrdIKrtFfg0bop.jpg', fee: 450 },
        { id: 4, name: 'Dr. Dallington Lisa', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Psychiatrist', experience: `4 Yrs`, languages: `English, Runyankore, Luganda`, src: 'https://thumbs.dreamstime.com/b/portrait-positive-black-doctor-holding-medical-chart-male-over-white-background-178499631.jpg', fee: 500 },
        { id: 5, name: 'Dr. John Peterson', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Pediatric', experience: `10 Yrs`, languages: `English, Luganda`, src: 'https://st.depositphotos.com/1770836/1357/i/950/depositphotos_13576597-stock-photo-female-doctor-or-nurse.jpg', fee: 800 },
        { id: 6, name: 'Dr. Chelsea Finn', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Orthopedic', experience: `2 Yrs`, languages: `English, Swahili`, src: 'https://static2.bigstockphoto.com/4/7/3/large1500/374246794.jpg', fee: 650 },
        { id: 7, name: 'Dr. Moses Alfred', phoneNumber: '0774014727', course: 'MBBS, DNB', title: 'Neurology', experience: `3 Yrs`, languages: `Swahili, Luganda`, src: 'https://www.shape.com/thmb/3BaNRJiYmLa4HCkvORgFpj7c1Xo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/black-female-doctor-6d6a6c2ec3ae48ceaeeae61f78b7038e.jpg', fee: 250 },
        { id: 8, name: 'Dr. Peterson Lkein', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Pediatrician', experience: `6 Yrs`, languages: `English, German, Luganda`, src: 'https://purepng.com/public/uploads/large/purepng.com-doctorsdoctorsdoctors-and-nursesa-qualified-practitioner-of-medicine-aclinicianmedical-practitionermale-doctor-1421526856715fcree.png', fee: 150 },
        { id: 9, name: 'Dr. Ivan Luna', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Anesthesiologist', experience: `2 Yrs`, languages: `English, Spanish, Swahili`, src: 'https://www.pngfind.com/pngs/m/53-531148_black-doctor-png-black-medical-doctor-png-transparent.png', fee: 980 },
        { id: 10, name: 'Dr. Isaac Newton', phoneNumber: '0774014727', course: 'MBBS, DNB', title: 'Oncology', experience: `7 Yrs`, languages: `English`, src: 'https://www.seekpng.com/png/full/13-132502_alligator-black-male-doctor-png.png', fee: 160 },
        { id: 11, name: 'Dr. Hamson Wilson', phoneNumber: '0700477421', course: 'MBBS, DNB', title: 'Endocrinologist', experience: `8 Yrs`, languages: `Spanish, Luo, Luganda`, src: 'https://pngimg.com/uploads/doctor/doctor_PNG15957.png', fee: 115 },
        { id: 12, name: 'Dr. Allen Kemi', phoneNumber: '0774014727', course: 'MBBS, DNB', title: 'Dermatologist', experience: `2 Yrs`, languages: `English, Runyankore`, src: 'https://i.pinimg.com/originals/5b/a1/a3/5ba1a398ac0aa7fe01480166fd2b818f.png', fee: 175 },
    ]


    const bookSpecialist = (item: SpecialityDetail) => {
        
        let doctor = {
            src: item.src,
            name: item.name,
            phoneNumber: item.phoneNumber,
            title: item.title
        }
        navigation.navigate('ScheduleAppointment', doctor);
    }


    const renderItem = ({ item }: { item: SpecialityDetail }) => (

        <View style={styles.item}>
            <View style={styles.header}>
                <View>
                    <Avatar.Image size={80} source={{ uri: item.src }} />
                </View>
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.titles}>{item.course}</Text>
                    <Text style={styles.userTitle}>{item.title}</Text>
                </View>
            </View>

            <View style={styles.body}>
                <View>
                    <Text style={styles.titles}>Experience</Text>
                    <Text style={styles.values}>{item.experience}</Text>
                </View>
                <View>
                    <Text style={styles.titles}>Language</Text>
                    <Text style={styles.values}>{item.languages}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.fees}>Fee:  <Text style={styles.amount}>${item.fee}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => bookSpecialist(item)}
                    >
                        <Text style={styles.btnTxt}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Doctors available in this speciality</Text>
            <View style={styles.subcontainer}>
                <FlatList
                    data={specialities}
                    renderItem={renderItem}
                    keyExtractor={(item: SpecialityDetail, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

        </SafeAreaView>
    )
}

export default SpecialityListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: configs.colors.dark,
        fontWeight: 'bold',
        marginVertical: 10,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    item: {
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 10,
        backgroundColor: configs.colors.white,
        padding: 30,
        elevation: 5
    },

    itemTitle: {
        color: '#000'
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'space-around'
    },

    body: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },

    bookBtn: {
        padding: 8,
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: configs.colors.primary,
        borderColor: configs.colors.primary,
        width: 100,
        alignItems: 'center',
    },

    btnTxt: {
        color: configs.colors.white
    },

    name: {
        color: configs.colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    userTitle: {
        fontSize: 16,
        color: configs.colors.primary,
    },

    titles: {
        opacity: 0.8,
        fontSize: 16,
    },

    values: {
        fontWeight: 'bold',
        color: configs.colors.black,
        opacity: 0.6,
        fontSize: 14,
    },

    fees: {
        top: 10,
    },

    amount: {
        color: configs.colors.primary,
        fontWeight: 'bold',
    }

})

