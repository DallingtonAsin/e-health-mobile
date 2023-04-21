import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserToken = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('access_token', jsonValue)
    } catch (e) {
        throw e;
    }
}

const getUserToken = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('access_token')
        const result = jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log(`result`, result)
        return result;
    } catch (e) {
        throw e;
    }
}

export { storeUserToken, getUserToken }