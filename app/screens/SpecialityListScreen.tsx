import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as colors from '../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';

const SpecialityListScreen = () => {

    const specialities = [
        { id: 1, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 2, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 3, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 4, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 5, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 6, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 7, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 8, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 9, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 10, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 11, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
        { id: 12, name: 'Dr. Anthony Luna', course: 'MBBS, DNB', title: 'Nutrionist', experience: `5 Yrs`, languages: `English, Swahili, Luganda` },
    ]


    const renderItem = ({ item }) => (
        <View elevation={5} style={styles.item}>
            <View style={styles.header}>
                <View>
                    <Avatar.Image size={80} source={require('../assets/elon.jpeg')} />
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
                    <Text style={styles.fees}>Fee :  <Text style={styles.amount}>$200</Text></Text>
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
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: colors.default.primary,
        borderColor: colors.default.primary,
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

