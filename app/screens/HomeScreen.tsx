import React from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import * as colors from '../configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

const iconSize = 50;

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                backgroundColor={colors.default.primary}
            />
            <Text style={styles.title}>Welcome to Vastel Medical Services</Text>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainerStyle}
            >
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Icon name="rocket" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>Specialists</Text>
                    </View>

                    <View style={styles.card}>
                        <Icon5 name="video" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>Meeting</Text>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Icon5 name="check-circle" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>My Approvals</Text>
                    </View>

                    <View style={styles.card}>
                        <Icon5 name="info-circle" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>Help</Text>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Icon5 name="wrench" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>Services</Text>
                    </View>

                    <View style={styles.card}>
                        <Icon5 name="info-circle" size={iconSize} color={colors.default.pink} />
                        <Text style={styles.subtitle}>Help</Text>
                    </View>
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
        alignItems: 'center',
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
        borderWidth: 1,
        borderColor: 'gray',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 10,
        alignItems: 'center',
        textShadowColor: 'gray',
        shadowOffset: {
            height: 4,
            width: 4
        },
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})