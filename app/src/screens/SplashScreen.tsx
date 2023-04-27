import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import * as configs from '../configs';
import Avatar from '../components/Avatar';

const SplashScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={configs.colors.primary} />
            <View style={styles.header}>
                <Avatar size={125} borderRadius={75} source={configs.images.logo} resizeMode={'cover'} isURL={false} anyStyles={{ borderWidth: 6, borderColor: configs.colors.primary }} />
                <Text style={styles.slogan}>Bringing healthcare to your fingertips</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[configs.styles.secondaryBtn, { marginVertical: 5 }]} onPress={() => { navigation.navigate('Signin') }}>
                    <Text style={[styles.btnText, { color: configs.colors.primary }]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[configs.styles.primaryBtn]} onPress={() => { navigation.navigate('EnterPhoneNumber') }}>
                    <Text style={styles.btnText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
        alignItems: 'center',
    },

    header: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        position: 'absolute',
        marginBottom: 40,
    },

    slogan: {
        fontSize: 20,
        color: configs.colors.primary,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 15,
        marginHorizontal: 80,
        opacity: 0.9
    },

    btnText: {
        color: configs.colors.white,
        fontSize: configs.fonts.extraLarge,
        fontWeight: 'bold'
    },

    logo: {
        borderWidth: 1,
        borderColor: configs.colors.primary
    }

})