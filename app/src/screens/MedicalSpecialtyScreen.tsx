import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Searchbar } from 'react-native-paper';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import { MedicalSpecialty } from "../interfaces";

const MedicalSpecialtyScreen = ({ navigation }: { navigation: any }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [medicalSpecialties, setMedicalSpecialties] = useState<MedicalSpecialty[]>([]);
    const [filteredData, setFilteredData] = useState<MedicalSpecialty[]>([]);

    const { getMedicalSpecialties } = useContext(AppContext);

    useEffect(() => {
        getMedicalSpecialties({ onSuccess: populateSpecialities, onFailure: displayMessage, onCompletion: stopLoading });
    }, []);

    const populateSpecialities = (medicalSpecialties: MedicalSpecialty[]) => {
        setMedicalSpecialties(medicalSpecialties);
        setFilteredData(medicalSpecialties);
    }

    const handleSearch = (text: string) => {

        setSearchQuery(text);
        const newData = medicalSpecialties.filter((item: MedicalSpecialty) => {
            const itemData = `${item.name}`;
            const searchText = text.toLowerCase();
            return itemData.toLowerCase().indexOf(searchText) > -1;
        });
        if (text.length > 0) {
            setFilteredData(newData);
        } else {
            setFilteredData(medicalSpecialties);
        }
    };

    const stopLoading = () => {
        setIsLoading(false);
    }

    const Item = ({ item }: { item: MedicalSpecialty }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SpecialitiesList', { specialty_id: item.id, specialty_name: item.name })}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Icon5 name="angle-right" size={20} color={configs.colors.primary} style={styles.arrow} />
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: MedicalSpecialty }) => (
        <Item item={item} />
    );

    if (isLoading) {
        return (
            <AppLoader bgColor={configs.colors.white} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Find your doctor by speciality</Text>
            <View style={styles.subcontainer}>
                <Searchbar
                    placeholder="Search specialty"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                    elevation={3}
                    inputStyle={styles.searchbarInput}
                />
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item: MedicalSpecialty, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    style={{ top: 20 }}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            </View>
        </SafeAreaView>
    )
}

export default MedicalSpecialtyScreen;

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
        paddingVertical: 0,
        backgroundColor: configs.colors.white,
    },

    searchbarInput: {
        fontSize: configs.fonts.large,
    },

    arrow: {
        right: 0
    }
});