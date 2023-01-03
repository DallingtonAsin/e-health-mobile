import React, { useState } from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as configs from '../configs';
import { Avatar } from 'react-native-paper';
import { DoctorsDetail } from "../interfaces";
import { initialSpecialities } from "../configs/constants";

const MedicalDoctorsScreen = ({ navigation }: { navigation: any }) => {

    const [specialities, setSpecialities] = useState<DoctorsDetail[]>(initialSpecialities);
    
    const bookSpecialist = (item: DoctorsDetail) => {
        
        let doctor = {
            first_name: item.first_name,
            last_name: item.last_name,
            phone_number: item.phone_number,
            src: item.image,
            title: item.title
        }
        navigation.navigate('ScheduleAppointment', doctor);
    }


    const renderItem = ({ item }: { item: DoctorsDetail }) => (

        <View style={styles.item}>
            <View style={styles.header}>
                <View>
                    <Avatar.Image size={80} source={{ uri: item.image }} />
                </View>
                <View>
                    <Text style={styles.name}>{item.title} {item.first_name} {item.last_name}</Text>
                    <Text style={styles.titles}>{item.qualification}</Text>
                    <Text style={styles.userTitle}>{item.profession}</Text>
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
                    <Text style={styles.fees}>Fee:  <Text style={styles.amount}>${item.service_fee}</Text></Text>
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
                    keyExtractor={(item: DoctorsDetail, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

        </SafeAreaView>
    )
}

export default MedicalDoctorsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
    },

    title: {
        fontSize: configs.fonts.large,
        textAlign: 'center',
        color: configs.colors.dark,
        fontWeight: '600',
        marginVertical: 10,
        opacity:0.7
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
        fontSize: configs.fonts.large,
        color: configs.colors.primary,
    },

    titles: {
        opacity: 0.8,
        fontSize: configs.fonts.normal,
    },

    values: {
        fontWeight: 'bold',
        color: configs.colors.black,
        opacity: 0.6,
        fontSize: configs.fonts.normal,
    },

    fees: {
        top: 10,
    },

    amount: {
        color: configs.colors.primary,
        fontWeight: 'bold',
    }

})

