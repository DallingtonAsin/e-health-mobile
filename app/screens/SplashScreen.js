import {View, Text, StyleSheet, Pressable,  StatusBar, } from 'react-native'
import * as colors from '../configs/colors';
import { Avatar } from 'react-native-paper';


const SplashScreen = ({navigation}) => {
    return (
        <View style={styles.container}> 
        <StatusBar
                backgroundColor={colors.default.primary}
            />
            <View style={styles.header}>
            <Avatar.Image style={styles.logo} size={150} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/professions-1-2/151/3-512.png' }} />
            </View>
            <View style={styles.footer}>
            <Pressable style={styles.nextBtn} onPress={() => {navigation.navigate('Home')}}>
                <Text style={styles.nextText}>Next</Text>
             </Pressable>
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
        backgroundColor: colors.default.white,
        justifyContent: 'center',
        alignItems: 'center'

    },

    nextBtn: {
        backgroundColor: colors.default.primary,
        borderColor: colors.default.primary,
        paddingVertical: 15,
        paddingHorizontal:'40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        bottom: 40,

    },

    nextText: {
        color: colors.default.white,
        fontSize: 20,
        fontWeight: 'bold',
    },

    logo: {
        
    }

})