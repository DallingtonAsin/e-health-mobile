import { Linking } from "react-native";
import Communications from 'react-native-communications';
import { Notifications } from 'react-native-notifications'

const callPhoneNumber = (phoneNumber: string) => {
    Communications.phonecall(phoneNumber, true);
};

const sendSms = (telephone_number: string) => {
    Communications.text(telephone_number, '');
}

const inboxWhatsappNumber = (whatsappNumber: string) => {
    Linking.openURL(`whatsapp://send?text=&phone=${whatsappNumber}`);
}

const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}?subject=Message`);
};

const showLocalNotification = (title: string, body: string | any) => {
    const notification: any = {
        title: title,
        body: body,
        sound: 'default',
    };

    Notifications.postLocalNotification(notification);
};

export { callPhoneNumber, sendSms, inboxWhatsappNumber, sendEmail, showLocalNotification }