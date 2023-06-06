import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const StickerWithText = ({ text }: { text: string }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFC107',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StickerWithText

