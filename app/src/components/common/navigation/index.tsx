import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const navigate = (navigation: NativeStackNavigationProp<any>, screenName: string, data: any = null) => {
    if (data) {
        navigation.navigate(screenName, data);
    } else {
        navigation.navigate(screenName);
    }
};

export { navigate }