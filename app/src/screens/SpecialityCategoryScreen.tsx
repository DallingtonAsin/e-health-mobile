import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, ListRenderItemInfo } from "react-native";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Searchbar } from 'react-native-paper';

interface SpecialityCategory {
    id: number,
    name: string,
}

const SpecialityCategoryScreen = ({ navigation }: { navigation: any }) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);

    const specialities = [
        { id: 1, name: 'Cardic Surgery' },
        { id: 2, name: 'Eye Specialist' },
        { id: 3, name: 'Clinic Nutrietion' },
        { id: 4, name: 'Cardic Doctor' },
        { id: 5, name: 'Child Specialist' },
        { id: 6, name: 'Ear Nose Throat' },
        { id: 7, name: 'Cardic Surgery' },
        { id: 8, name: 'Cardiology' },
        { id: 9, name: 'Clinic Nutrietion' },
        { id: 10, name: 'Cardic Surgery' },
        { id: 11, name: 'Cardiology' },
        { id: 12, name: 'Clinic Nutrietion' },
    ]

    const Item = ({ item }: {item: SpecialityCategory}) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SpecialitiesList')}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Icon5 name="angle-right" size={20} color={configs.colors.primary} style={styles.arrow} />
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: SpecialityCategory }) => (
        <Item item={item} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Find your doctor by speciality</Text>
            <View style={styles.subcontainer}>
                <Searchbar
                    placeholder="Search for doctor"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                    elevation={3}
                    inputStyle={styles.searchbarInput}
                />
                <FlatList
                    data={specialities}
                    renderItem={renderItem}
                    keyExtractor={(item: SpecialityCategory, index:number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    style={{ top: 20 }}
                    ListFooterComponent={<View style={{height: 100}}/>}
                />
            </View>

        </SafeAreaView>
    )
}

export default SpecialityCategoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: configs.fonts.extraLarge,
        textAlign: 'left',
        left: 28,
        fontWeight: '700',
        marginVertical: 10,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
        top: 15,
    },
    
    itemTitle: {
        color: '#000',
        fontSize: configs.fonts.medium,
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
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },


    searchbar: {
        marginHorizontal: 16,
        paddingVertical: 3,
        backgroundColor: configs.colors.white,
    },

    searchbarInput:{
        fontSize: configs.fonts.large,
    },

    arrow: {
        right: 0
    }
})

