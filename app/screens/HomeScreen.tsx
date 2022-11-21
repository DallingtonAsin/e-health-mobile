import React, {useState} from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
} from 'react-native';
import * as colors from '../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';

const iconSize = 45;

const HomeScreen = ({ navigation }) => {

    const [user, setUser] = useState(`Dallington`);

    const comingSoon = () => {
        Toast.show(`Coming soon...`, Toast.LONG);
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                backgroundColor={colors.default.primary}
            />
            
            <Text style={styles.greeting}>Welcome, {user}!</Text>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainerStyle}
            >

                <View style={styles.imageContainer}>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../assets/home_icon.png')}
                    />
                </View>

                <Text style={styles.title}>Quick Actions</Text>


                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SpecialityCategories')}>
                        <Icon name="users" size={iconSize} color={colors.default.primary} />
                        <Text style={styles.subtitle}>Specialists</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Icon5 name="calendar-alt" size={iconSize} color={colors.default.primary} />
                        <Text style={styles.subtitle}>My Appointments</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.cardContainer}>

                    <TouchableOpacity style={styles.card} onPress={comingSoon}>
                        <Icon5 name="check-circle" size={iconSize} color={colors.default.primary} />
                        <Text style={styles.subtitle}>My Approvals</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={comingSoon}>
                        <Icon5 name="video" size={iconSize * 0.92} color={colors.default.primary} />
                        <Text style={styles.subtitle}>Meeting</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.card} onPress={comingSoon}>
                        <Icon name="wrench" size={iconSize} color={colors.default.primary} />
                        <Text style={styles.subtitle}>Services</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`ContactUs`)}>
                        <Icon5 name="info-circle" size={iconSize} color={colors.default.primary} />
                        <Text style={styles.subtitle}>Help</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    scrollContainerStyle: {
        flexGrow: 1,
        // alignItems: 'center',
        justifyContent: 'center',

    },

    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 35,
    },

    card: {
        flex: 1,
        borderRadius: 100 / 20,
        borderWidth: 0.5,
        borderColor: 'gray',
        marginHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 22,
        paddingHorizontal: 5,
        alignItems: 'center',
        textShadowColor: 'gray',
        backgroundColor: colors.default.white,
        shadowOffset: {
            height: 4,
            width: 4
        },
    },

    title: {
        fontSize: 17,
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        marginTop: 20,
        textTransform: 'capitalize',
        color: colors.default.dark,
        opacity: 0.7,
    },

    greeting: {
        fontSize: 24,
        textAlign: 'left',
        fontWeight: 'bold',
        fontStyle: 'normal',
        marginTop: 20,
        textTransform: 'capitalize',
        color: colors.default.dark,
        opacity: 0.8,
        left:40,
        marginVertical:10,
    },

    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        top: 5
    },

    tinyLogo: {
        width: 220,
        height: 200,
        resizeMode: 'stretch',
    },

    imageContainer: {
        marginVertical: 0,
        alignSelf:'center'
    }
})