import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import * as configs from "../configs";
import {Button} from "react-native-paper";
import {colors} from "../configs";

const HeroCard = ({ balance }) => {
    return (
        <ImageBackground style={styles.cardContainer} source={configs.images.homeHero} imageStyle={{ borderRadius: 10}}>
            <View style={styles.column}>
                <Text style={styles.title}>Find your desired specialist</Text>
                <Text style={styles.textColor}>With your digital healthcare assistant</Text>
                <Button mode="contained" onPress={() => console.log('Pressed')} style={{marginTop: 10, backgroundColor: configs.colors.danger}}>
                    SEE OUR SPECIALISTS
                </Button>
            </View>
            <View style={styles.column}>
                <View style={{backgroundColor: colors.white, borderRadius: 5}}>
                    <View style={{marginHorizontal: 10, marginVertical: 10, alignItems: "flex-end"}}>
                        <Text style={styles.title}> Account Balance</Text>
                        <Text style={{color: colors.green}}>50000.00</Text>
                    </View>

                </View>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },

    textColor: {
        color: '#565151'
    },
    title: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: '600'
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    column: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20,
    },
});

export default HeroCard;
