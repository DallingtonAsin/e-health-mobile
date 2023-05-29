import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import * as configs from '../configs'

const NotificationCard = ({ onPress, title, message, isRead }: { onPress?: any, title: string, message: string, isRead: boolean }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.line} />
            </View>
            <TouchableOpacity onPress={onPress} style={styles.card}>
                <View style={isRead ? styles.dotRead : styles.dotUnread}></View>
                <View>
                    <Text style={styles.message}>{message}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },

    titleContainer: {
        marginLeft: 12,
    },
    title: {
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textTransform: 'capitalize',
        marginLeft: 5,
    },
    line: {
        width: 2,
        height: 10,
        backgroundColor: 'transparent',
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: configs.colors.gray,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    card: {
        flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 12,
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        padding: 12,
        elevation: 5,
    },
    message: {
        fontSize: configs.fonts.medium,
    },

    dotRead: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.gray,
        marginRight: 10,
    },

    dotUnread: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.orange,
        marginRight: 10,
    },
})

export default NotificationCard
