import { getUniqueId } from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import messaging from '@react-native-firebase/messaging';

const getDeviceId = async() => {
    let device_id = await getUniqueId()
    return device_id
}

const getIPAddress = async () => {
    let ip_address: any = await NetworkInfo.getIPAddress();
    return ip_address
}

const getToken = async () => {
    const token = await messaging().getToken()
    return token
}

export { getDeviceId, getIPAddress, getToken }