import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as colors from '../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

const SpecialitiesScreen = () => {

    const specialities = [
        { id: 1, name: 'Cardic Surgery' },
        { id: 2, name: 'Cardiology' },
        { id: 3, name: 'Clinic Nutrietion' },
        { id: 4, name: 'Cardic Doctor' },
        { id: 5, name: 'Cardiology Nurse' },
        { id: 6, name: 'Clinic Tetanus' },
        { id: 7, name: 'Cardic Surgery' },
        { id: 8, name: 'Cardiology' },
        { id: 9, name: 'Clinic Nutrietion' },
        { id: 10, name: 'Cardic Surgery' },
        { id: 11, name: 'Cardiology' },
        { id: 12, name: 'Clinic Nutrietion' },
    ]

    const Item = ({ title }) => (
        <View elevation={5} style={styles.itemView}>
            <TouchableOpacity style={styles.item}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Icon5 name="angle-right" size={20} color={colors.default.pink} style={styles.arrow} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <Item title={item.name} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Find your consultation</Text>
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

export default SpecialitiesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.default.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.default.pink,
        fontWeight: 'bold',
        marginVertical: 10,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    
    itemView: {
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
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.default.white,
        padding: 20,
    },

    itemTitle: {
        color: '#000'
    },

    arrow: {
        right: 0
    }
})

