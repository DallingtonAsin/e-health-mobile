import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAuthToken = async (authToken: string) => {
    try {
        let value = JSON.stringify(authToken);
        await AsyncStorage.setItem("authorization", value);
    } catch (error) {
        throw error;
    }
}

const getAuthToken = async() => {
    try{
        let authToken = await AsyncStorage.getItem("authorization");
        authToken = authToken ? JSON.parse(authToken) : null;
        
        return authToken;
    }catch(err){
        throw err;
    }
}

const storeAccessToken = async (accessToken: string) => {
   
    try {
        let value = JSON.stringify(accessToken);
        await AsyncStorage.setItem("access_token", value);
    } catch (error) {
        throw error;
    }
}

const getAccessToken = async() => {
    try{
        let accessToken = await AsyncStorage.getItem("access_token");
        accessToken = accessToken ? JSON.parse(accessToken) : null;
        
        return accessToken;
    }catch(err){
        throw err;
    }
}

export { storeAuthToken, getAuthToken, getAccessToken, storeAccessToken,  }