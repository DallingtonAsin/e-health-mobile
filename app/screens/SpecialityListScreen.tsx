import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as colors from '../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';

const SpecialityListScreen = () => {

    const specialities = [
        { id: 1, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda`, src: require('../assets/specialists/1.png'), fee: 800},
        { id: 2, name: 'Dr. Grace Kaisa', course: 'MBBS, DNB', title: 'Dentist', experience: `3 Yrs`, languages: `English, Luganda`, src: require('../assets/specialists/2.jpg'), fee: 330 },
        { id: 3, name: 'Dr. Herman Keid', course: 'MBBS, DNB', title: 'Surgeon', experience: `1 Yr`, languages: `English, Luo, Luganda`, src: require('../assets/specialists/3.jpg'), fee: 450 },
        { id: 4, name: 'Dr. Dallington Lisa', course: 'MBBS, DNB', title: 'Psychiatrist', experience: `4 Yrs`, languages: `English, Runyankore, Luganda`, src: require('../assets/specialists/4.jpg'), fee: 500 },
        { id: 5, name: 'Dr. John Peterson', course: 'MBBS, DNB', title: 'Pediatric', experience: `10 Yrs`, languages: `English, Luganda`, src: require('../assets/specialists/5.png'), fee: 800 },
        { id: 6, name: 'Dr. Chelsea Finn', course: 'MBBS, DNB', title: 'Orthopedic', experience: `2 Yrs`, languages: `English, Swahili`, src: require('../assets/specialists/6.jpg'), fee: 650 },
        { id: 7, name: 'Dr. Moses Alfred', course: 'MBBS, DNB', title: 'Neurology', experience: `3 Yrs`, languages: `Swahili, Luganda`, src: require('../assets/specialists/7.jpg'), fee: 250 },
        { id: 8, name: 'Dr. Peterson Lkein', course: 'MBBS, DNB', title: 'Pediatrician', experience: `6 Yrs`, languages: `English, German, Luganda`, src: require('../assets/specialists/8.jpeg'), fee: 150 },
        { id: 9, name: 'Dr. Ivan Luna', course: 'MBBS, DNB', title: 'Anesthesiologist', experience: `2 Yrs`, languages: `English, Spanish, Swahili`, src: require('../assets/specialists/9.png'), fee: 980 },
        { id: 10, name: 'Dr. Isaac Newton', course: 'MBBS, DNB', title: 'Oncology', experience: `7 Yrs`, languages: `English`, src: require('../assets/specialists/10.jpg'), fee: 160 },
        { id: 11, name: 'Dr. Hamson Wilson', course: 'MBBS, DNB', title: 'Endocrinologist', experience: `8 Yrs`, languages: `Spanish, Luo, Luganda`, src: require('../assets/specialists/11.png'), fee: 115 },
        { id: 12, name: 'Dr. Allen Kemi', course: 'MBBS, DNB', title: 'Dermatologist', experience: `2 Yrs`, languages: `English, Runyankore`, src: require('../assets/specialists/12.jpg'), fee: 175 },
    ]


    const renderItem = ({ item }) => (
        
        <View elevation={5} style={styles.item}>
            <View style={styles.header}>
                <View>
                    <Avatar.Image size={80} source={item.src} />
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
                    <Text style={styles.fees}>Fee :  <Text style={styles.amount}>${item.fee}</Text></Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.bookBtn}>
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
                    keyExtractor={item => item.id}
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
        backgroundColor: colors.default.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        // alignItems: 'center',
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.default.dark,
        fontWeight: 'bold',
        marginVertical: 10,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    item: {
        shadowColor: colors.default.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 10,
        backgroundColor: colors.default.white,
        padding: 30,


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
        backgroundColor: colors.default.primary,
        borderColor: colors.default.primary,
        width:100,
        alignItems: 'center',
    },

    btnTxt: {
        color: colors.default.white
    },

    name: {
        color: colors.default.black,
        fontSize:18,
        fontWeight: 'bold'
    },

    userTitle: {
        fontSize:16,
        color: colors.default.primary,
    },

    titles: {
        opacity:0.8,
        fontSize:16,
    },

    values: {
        fontWeight: 'bold',
        color: colors.default.black,
        opacity: 0.6,
        fontSize:14,
    },

    fees: {
      top:10,
    },

    amount: {
        color: colors.default.primary,
        fontWeight: 'bold',
    }

})

