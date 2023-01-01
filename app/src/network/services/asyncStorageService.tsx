import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAccessToken = async (accessToken: string) => {
    var value = JSON.stringify(accessToken);
    try {
        await AsyncStorage.setItem("authorization", value);
    } catch (error) {
        throw error;
    }
}

const getAccessToken = async() => {
    try{
        let token = await AsyncStorage.getItem("authorization");
        token = token ? JSON.parse(token) : null;
        
        return token;
    }catch(err){
        throw err;
    }
}

export { getAccessToken, storeAccessToken,  }