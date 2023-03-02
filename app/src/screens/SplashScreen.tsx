import { View, Text, StyleSheet, TouchableOpacity,  StatusBar } from 'react-native'
import * as configs from '../configs';
import Avatar from '../components/Avatar';

const SplashScreen = ({navigation}: {navigation: any}) => {
    return (
        <View style={styles.container}> 
        <StatusBar backgroundColor={configs.colors.primary}/>
            <View style={styles.header}>
            <Avatar size={135} borderRadius={75} source={`https://www.coachcare.com/uploads/doctor-patient-relationships-in-telemedicine.png`}/>
            <Text style={styles.drText}>Access doctor anytime anywhere</Text>
            </View>
            <View style={styles.footer}>
             <TouchableOpacity style={[configs.styles.secondaryBtn, configs.styles.bottomizedBtn]} onPress={() => {navigation.navigate('Signin')}}>
                <Text style={configs.styles.btnText}>Next</Text>
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
        alignItems: 'center'

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