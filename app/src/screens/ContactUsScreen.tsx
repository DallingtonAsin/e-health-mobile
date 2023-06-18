import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';

interface Contact {
    id: number,
    text: string,
    value: string,
    icon: string
    method?: any,
}

const ContactUsScreen = () => {

    const contacts = [
        { id: 1, text: 'Telephone', value: `+256772409074`, icon: 'phone-alt', method: contact.callPhoneNumber },
        { id: 2, text: 'SMS', value: `+256704709074`, icon: 'sms', method: contact.SendSms },
        { id: 3, text: 'Whatsap', value: `+256704709074`, icon: 'whatsapp', method: contact.inboxWhatsappNumber },
        { id: 4, text: 'Email', value: `info@vastel.com`, icon: 'envelope', method: contact.SendEmail }
    ]

    const renderItem = ({ item }: { item: Contact }) => (
        <TouchableOpacity style={styles.item} onPress={() => item.method(item.value)}>
            <View style={{ flexDirection: 'row' }}>
                <Icon5 name={item.icon} size={25} color={configs.colors.primary} style={styles.arrow} />
                <View style={styles.verticleLine}></View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.contactTitle}>{item.text}</Text>
                    <Text style={styles.itemTitle}>{item.value}</Text>
                </View>
            </View>

            <Icon5 name="angle-right" size={20} color={configs.colors.primary} style={styles.arrow} />

        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
           
            <View style={styles.subcontainer}>
            <Text style={styles.title}>Need help? Please contact us.</Text>
                <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={(item: Contact, index: number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    style={{ top: 20, bottom: 40 }}
                />
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

    scrollContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: configs.fonts.extraLarge,
        textAlign: 'center',
        color: configs.colors.dark,
        // fontWeight: 'bold',
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
        // fontWeight: 'bold',
    },

    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'silver',
        left: 8
    }
})

