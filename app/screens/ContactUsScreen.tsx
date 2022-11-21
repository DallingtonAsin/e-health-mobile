import React from "react";
import { SafeAreaView, FlatList, View, StyleSheet, Text, TouchableOpacity, Linking } from "react-native";
import * as colors from '../configs/colors';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Communications from 'react-native-communications';


interface Contact {
    id: number | null,
    text: string | null,
    value:string,
    icon: string
    method?: any,
}

const ContactUsScreen = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);


    const callHelpLine = (phoneNumber: string) => {
        Communications.phonecall(phoneNumber, true);
    };

    const SendSms = (telephone_number: string) => {
        Communications.text(telephone_number, '');
    }

    const inboxFromWhatsapp = (whatsappNumber: string) => {
        Linking.openURL(`whatsapp://send?text=&phone=${whatsappNumber}`);
    }

    const SendEmail = (email: string) => {
        Linking.openURL(`mailto:${email}?subject=Message`);
    };

    const contacts = [
        { id: 1, text: 'Telephone', value: `+256772409074`, icon: 'phone-alt', method: callHelpLine },
        { id: 2, text: 'SMS', value: `+256704709074`, icon: 'sms', method: SendSms },
        { id: 3, text: 'Whatsap', value: `+256772409074`, icon: 'whatsapp', method: inboxFromWhatsapp },
        { id: 4, text: 'Email', value: `info@vastel.com`, icon: 'envelope', method: SendEmail }
    ]


    const renderItem = ({ item }: {item: Contact}) => (
        <TouchableOpacity style={styles.item} onPress={() => item.method(item.value)}>
            <View style={{ flexDirection: 'row' }}>
                <Icon5 name={item.icon} size={40} color={colors.default.primary} style={styles.arrow} />
                <View style={styles.verticleLine}></View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.contactTitle}>{item.text}</Text>
                    <Text style={styles.itemTitle}>{item.value}</Text>
                </View>
            </View>

            <Icon5 name="angle-right" size={20} color={colors.default.primary} style={styles.arrow} />

        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Need help? Please contact us.</Text>
            <View style={styles.subcontainer}>
                <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
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
        backgroundColor: colors.default.white,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.default.dark,
        fontWeight: 'bold',
        marginVertical: 10,
        opacity: 0.8
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
        top: 15,
    },

    item: {
        shadowColor: colors.default.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.6,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: colors.default.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },

    itemTitle: {
        color: '#000',
        fontSize: 15,

    },

    arrow: {
        right: 0
    },

    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'silver',
        left: 8
      }
})

