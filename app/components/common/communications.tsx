import { Linking } from "react-native";
import Communications from 'react-native-communications';

const callPhoneNumber = (phoneNumber: string) => {
    Communications.phonecall(phoneNumber, true);
};

const SendSms = (telephone_number: string) => {
    Communications.text(telephone_number, '');
}

const inboxWhatsappNumber = (whatsappNumber: string) => {
    Linking.openURL(`whatsapp://send?text=&phone=${whatsappNumber}`);
}

const SendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}?subject=Message`);
};

export {callPhoneNumber, SendSms, inboxWhatsappNumber, SendEmail}