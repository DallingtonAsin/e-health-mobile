import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAccessToken = async (accessToken: string) => {
    var value = JSON.stringify(accessToken);
    try {
        await AsyncStorage.setItem("accessToken", value);
    } catch (error) {
        throw error;
    }
}

const getAccessToken = async() => {
    try{
        let token = await AsyncStorage.getItem("accessToken");
        token = token ? JSON.parse(token) : null;
        
        return token;
    }catch(err){
        throw err;
    }
}

export { getAccessToken, storeAccessToken,  }