import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { callPhoneNumber, sendSms, inboxWhatsappNumber, sendEmail } from '../components/common/communications';
import { Context as AppContext } from '../context/appContext'
import { CompanyInformation, ContactListItem, ICompanyListItem } from "../interfaces";
import { displayMessage } from "../components/common/SharedHelper";
import AppLoader from "../components/AppLoader";

const ContactUsScreen = () => {

    const initialListData = [
        { id: 1, type: 'Telephone', value: ``, icon: 'phone-alt', method: callPhoneNumber },
        { id: 2, type: 'SMS', value: ``, icon: 'sms', method: sendSms },
        { id: 3, type: 'Whatsap', value: ``, icon: 'whatsapp', method: inboxWhatsappNumber },
        { id: 4, type: 'Email', value: ``, icon: 'envelope', method: sendEmail }
    ]

    const [isLoading, setIsLoading] = useState(true)
    const [listData, setListData] = useState<ICompanyListItem[]>(initialListData)
    const { getCompanyInformation } = useContext(AppContext)

    const populateCompanyInfo = (data: CompanyInformation) => {
        const updatedData = listData.map(item => {
            switch (item.id) {
                case 1:
                    return { ...item, value: data.mobile_phone_no };
                case 2:
                    return { ...item, value: data.sms_phone_no };
                case 3:
                    return { ...item, value: data.whatsapp_number };
                case 4:
                    return { ...item, value: data.email };
                default:
                    return item;
            }
        });
        setListData(updatedData);
    }

    useEffect(() => {
        getCompanyInformation({ onSuccess: populateCompanyInfo, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }, [])

    const renderItem = ({ item }: { item: ContactListItem }) => (
        <TouchableOpacity style={styles.item} onPress={() => item.method(item.value)}>
            <View style={{ flexDirection: 'row' }}>
                <Icon5 name={item.icon} size={25} color={configs.colors.primary} style={styles.arrow} />
                <View style={styles.verticleLine}></View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.contactTitle}>{item.type}</Text>
                    <Text style={styles.itemTitle}>{item.value}</Text>
                </View>
            </View>
            <Icon5 name="angle-right" size={20} color={configs.colors.primary} style={styles.arrow} />
        </TouchableOpacity>
    );

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={styles.title}>Need help? Please contact us.</Text>
                <FlatList
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    style={{ top: 20, bottom: 40 }} />
            </View>
        </SafeAreaView>
    )
}

export default ContactUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },
    title: {
        fontSize: configs.fonts.extraLarge,
        textAlign: 'center',
        color: configs.colors.dark,
        marginVertical: 10,
        opacity: 0.8
    },
    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
        top: 15,
    },
    item: {
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.6,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },
    itemTitle: {
        color: '#000',
        fontSize: configs.fonts.medium,
    },
    arrow: {
        right: 0
    },
    contactTitle: {
        fontSize: configs.fonts.medium,
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'silver',
        left: 8
    }
})