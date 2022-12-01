import {View, Text, StyleSheet, TouchableOpacity,  StatusBar, } from 'react-native'
import * as colors from '../configs/colors';
import { Avatar } from 'react-native-paper';
// import * as Animatable from 'react-native-animatable';

const SplashScreen = ({navigation}) => {
    return (
        <View style={styles.container}> 
        <StatusBar
                backgroundColor={colors.default.primary}
            />
            <View style={styles.header}>
            <Avatar.Image size={150} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/professions-1-2/151/3-512.png' }} />
            <Text style={styles.drText}>Doctor Anywhere</Text>
            </View>
            <View style={styles.footer}>
            <TouchableOpacity style={styles.nextBtn} onPress={() => {navigation.navigate('Signin')}}>
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
        backgroundColor: colors.default.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },

    footer: {
        flex: 1,
        backgroundColor: colors.default.primary,
        justifyContent: 'center',
        alignItems: 'center'

    },

    nextBtn: {
        backgroundColor: colors.default.white,
        borderColor: colors.default.white,
        paddingVertical: 15,
        paddingHorizontal:'40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        bottom: 40,
    },

    btnText: {
        color: colors.default.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },

    drText: {
        fontSize:24,
        color: colors.default.white,
        textTransform: 'uppercase',
        paddingVertical: 15,
        fontWeight: 'bold'
    }

})