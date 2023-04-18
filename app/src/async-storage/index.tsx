import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('access_token', jsonValue)
    } catch (e) {
        throw e;
    }
}

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('access_token')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        throw e;
    }
}

export { storeData, getData }