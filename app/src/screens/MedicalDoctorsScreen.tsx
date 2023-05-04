import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import * as configs from '../configs';
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../components/Avatar';
import { DoctorsDetail } from "../interfaces";
import { Context as AppContext } from '../context/appContext';
import { Context as AuthContext } from '../context/authContext';
import { Context as DoctorContext } from '../context/doctorContext';
import { displayMessage, getUserInitials, truncateString } from '../components/common/SharedHelper';
import AppLoader from "../components/AppLoader";
import { Searchbar } from 'react-native-paper';
import CustomStackHeader from "../components/CustomStackHeader";
import Icon from 'react-native-vector-icons/FontAwesome';

const MedicalDoctorsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [medicalDoctors, setMedicalDoctors] = useState<DoctorsDetail[]>([]);
    const [filteredData, setFilteredData] = useState<DoctorsDetail[]>([]);
    const [specialtyName, setSpecialtyName] = useState<string>('');

    const { state } = useContext(AuthContext);
    const { getDoctorsBySpecialty } = useContext(AppContext);
    const { getMedicalDoctors } = useContext(DoctorContext);

    const user = state.user;

    const bookMedicalDoctor = (item: DoctorsDetail) => {
        navigation.navigate('ScheduleAppointment', { doctor_id: item.id });
    }

    useEffect(() => {
        if (route.params && route.params.specialty_id) {
            getDoctorsBySpecialty({ specialtyId: route.params.specialty_id, onSuccess: populateMedicalDoctors, onFailure: displayMessage, onCompletion: stopLoading })
        } else {
            getMedicalDoctors({ onSuccess: populateMedicalDoctors, onFailure: displayMessage, onCompletion: stopLoading });
        }

        if (route.params && route.params.specialty_name) {
            setSpecialtyName(route.params.specialty_name)
        }
    }, []);

    const populateMedicalDoctors = (doctors: DoctorsDetail[]) => {
        setMedicalDoctors(doctors);
        setFilteredData(doctors);
    }

    const handleSearch = (text: string) => {

        setSearchQuery(text);
        const newData = medicalDoctors.filter((item: DoctorsDetail) => {
            const searchText = text.toLowerCase();
            const doctorNames = `${item.first_name} ${item.last_name}`;
            const specialtyName = `${item.specialty}`;
            return doctorNames.toLowerCase().indexOf(searchText) > -1 || specialtyName.toLowerCase().indexOf(searchText) > -1;
        });
        if (text.length > 0) {
            setFilteredData(newData);
        } else {
            setFilteredData(medicalDoctors);
        }
    };

    const stopLoading = () => {
        setIsLoading(false);
    }

    const renderItem = ({ item }: { item: DoctorsDetail }) => (
        <View style={styles.item}>
            <View style={styles.header}>
                <View style={styles.image}>
                    {item.image
                        ? <Avatar size={80} source={item.image} resizeMode={'cover'}/>
                        : <AvatarRP.Text size={80} label={getUserInitials(`${item.first_name} ${item.last_name}`)} style={[configs.styles.userAvatar, { borderWidth: 0.5, borderColor: configs.colors.gray }]} />
                    }
                </View>
                <View style={styles.profile}>
                    <Text style={styles.name}>{`Dr.`} {item.first_name} {item.last_name}</Text>
                    <Text style={[styles.title, { color: configs.colors.secondary }]}>{item.specialty}</Text>
                    <Text style={styles.title}>{item.qualification}</Text>
                </View>
            </View>

            <View style={styles.body}>
                <View>
                    <Text style={[styles.title, { fontWeight: 'bold' }]}>Bio Summary</Text>
                    <Text style={styles.values}>{truncateString(item.bio_summary, 25)}</Text>
                </View>
            </View>

            {user.is_patient && <View style={styles.footer}>
                <View>
                    <Text style={styles.fees}>Fee/15 mins:  <Text style={styles.amount}>{item.service_fee}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => bookMedicalDoctor(item)}
                    >
                        <Text style={styles.btnTxt}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }

        </View>
    );

    const EmptyListMessage = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation" size={45} color={configs.colors.silver} />
            </View>
            <Text style={configs.styles.noInfoText}> {
                specialtyName ?
                    `No doctor found in ${specialtyName}`
                    : `No doctor found`}
            </Text>
        </View>
    );

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={specialtyName ? `${specialtyName} doctors` : `List of doctors`} onPress={() => navigation.goBack()} />
            <View style={styles.subcontainer}>
                {
                    medicalDoctors.length > 0 && <Searchbar
                        placeholder="Search doctor or specialty"
                        onChangeText={handleSearch}
                        value={searchQuery}
                        style={styles.searchbar}
                        elevation={2}
                        inputStyle={styles.searchbarInput}
                    />
                }

                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item: DoctorsDetail, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={EmptyListMessage}
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
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: configs.colors.white,
        paddingHorizontal: 18,
        paddingVertical: 20,
        elevation: 5
    },

    itemTitle: {
        color: '#000'
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    image: {
        flex: 1,
    },

    profile: {
        flex: 2,
        marginHorizontal: 12,
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
        fontSize: configs.fonts.large
    },

    userTitle: {
        fontSize: configs.fonts.large,
        color: configs.colors.black,
    },

    title: {
        fontSize: configs.fonts.large * 0.9,
    },

    values: {
        fontWeight: '300',
        color: configs.colors.black,
        opacity: 0.6,
        fontSize: configs.fonts.large,
    },

    fees: {
        top: 10,
    },

    amount: {
        color: configs.colors.primary,
        fontWeight: 'bold',
    },

    searchbar: {
        marginHorizontal: 10,
        paddingVertical: 0,
        marginVertical: 8,
        backgroundColor: configs.colors.white,
    },

    searchbarInput: {
        fontSize: configs.fonts.large,
    },



});