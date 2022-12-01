import {View, Text, StyleSheet, TouchableOpacity,  StatusBar} from 'react-native'
import * as configs from '../configs';
import { Avatar } from 'react-native-paper';

const SplashScreen = ({navigation}) => {
    return (
        <View style={styles.container}> 
        <StatusBar
                backgroundColor={configs.colors.primary}
            />
            <View style={styles.header}>
            <Avatar.Image size={150} source={{ uri: configs.urls.logo }} />
            <Text style={styles.drText}>Access doctor anywhere, anytime.</Text>
            </View>
            <View style={styles.footer}>
            <TouchableOpacity style={configs.styles.secondaryBtn} onPress={() => {navigation.navigate('Signin')}}>
                <Text style={styles.btnText}>Next</Text>
             </TouchableOpacity>
            </View>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flex: 1,
        backgroundColor: configs.colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },

    footer: {
        flex: 1,
        backgroundColor: configs.colors.primary,
        justifyContent: 'center',
        alignItems: 'center'

    },

    btnText: {
        color: configs.colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },

    drText: {
        fontSize:20,
        color: configs.colors.white,
        textTransform: 'capitalize',
        paddingVertical: 15,
        fontWeight: 'bold',
        marginHorizontal: 80,
        textAlign: 'center'
    }

})