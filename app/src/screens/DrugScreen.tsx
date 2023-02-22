import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as configs from '../configs';
import { Drug } from '../interfaces';
import { Searchbar } from 'react-native-paper';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';

const screen = Dimensions.get("screen")
const cardWidth = (screen.width - 25) / 2;

const DrugScreen = () => {
    
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [filteredData, setFilteredData] = useState<Drug[]>([]);
    const { getDrugs } = useContext(AppContext);

    useEffect(() => {
        getDrugs({ onSuccess: populateDrugs, onFailure: displayMessage, onCompletion: stopLoading });
    }, []);

    const stopLoading = () => {
        setIsLoading(false);
    }

    const populateDrugs = (drugs: Drug[]) => {
        setDrugs(drugs);
        setFilteredData(drugs);
    }

    const renderDrug = ({ item }: { item: Drug }) => {
        return (
            <TouchableOpacity style={styles.drugCard} onPress={() => console.log('View drug details')}>
                <View style={{ position: 'absolute', top: 3, right: 2 }}>
                    <Text style={[styles.drugStatus, item.in_stock ? { backgroundColor: configs.colors.primary } : { backgroundColor: configs.colors.danger }]}>{item.status}</Text>
                </View>

                <View style={styles.drugImageContainer}>
                    <Image style={styles.drugImage} source={{ uri: item.image }} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.drugName} numberOfLines={2} ellipsizeMode='tail'>{item.name}</Text>
                    <Text>{item.price}</Text>

                </View>

            </TouchableOpacity>
        );
    };

    const handleSearch = (text: string) => {

        setSearch(text);
        const newData = drugs.filter((item: Drug) => {
            const itemData = `${item.name}`;
            const searchText = text.toLowerCase();
            return itemData.toLowerCase().indexOf(searchText) > -1;
        });
        if (text.length > 0) {
            setFilteredData(newData);
        } else {
            setFilteredData(drugs);
        }
    };

    if (isLoading) {
        return (
            <AppLoader bgColor={configs.colors.white} />
        )
    }

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search medicine"
                placeholderTextColor={configs.colors.gray}
                onChangeText={handleSearch}
                value={search}
                style={[configs.styles.searchbar, { marginHorizontal: 3, marginBottom: 10 }]}
                elevation={3}
                inputStyle={configs.styles.searchbarInput}
            />


            <FlatList
                data={filteredData}
                renderItem={renderDrug}
                keyExtractor={(item) => item.id.toString()}
                style={styles.drugList}
                numColumns={2}
                columnWrapperStyle={styles.drugRow}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: 10,
                    paddingBottom: 50,
                }}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: configs.colors.white,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    drugList: {
        flex: 1,
    },

    drugRow: {
        justifyContent: 'space-between',
    },

    drugImageContainer: {
        height: 100,
        alignItems: 'center',
        marginTop: 12,
    },

    drugCard: {
        flex: 1,
        width: cardWidth,
        height: 225,
        backgroundColor: configs.colors.light,
        marginHorizontal: 2,
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        shadowColor: configs.colors.dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    textContainer: {
        padding: 10,
        maxWidth: '100%',
        maxHeight: '100%'
    },

    drugImage: {
        flex: 1,
        width: '100%',
        height: 225,
        resizeMode: 'contain'
    },

    drugInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },

    drugName: {
        marginTop: 10,
        color: configs.colors.primary,
        fontSize: 17,
        fontWeight: 'bold'
    },
    drugStatus: {
        fontSize: 10,
        padding: 2,
        borderRadius: 3,
        right: 0,
        color: configs.colors.white,
        fontWeight: 'bold',
    },
});

export default DrugScreen;
