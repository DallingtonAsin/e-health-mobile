import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as configs from "../../configs"
import { Button } from "react-native-paper"
import { colors } from "../../configs"
import { displayMessage } from '../../components/common/SharedHelper'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'

const TopupCard = ({ balance = 50, isPatient }: { balance: number, isPatient: boolean }) => {

    const topUp = () => {
        displayMessage('coming soon...')
    }

    return (
        <View style={styles.cardContainer}>
            {
                isPatient && <View style={styles.column}>
                    <Text style={styles.title}>Topup now to consult doctor</Text>
                    <Button mode="contained" onPress={topUp} style={{ marginTop: 10, backgroundColor: configs.colors.danger }}>
                        Top Up
                    </Button>
                </View>
            }
            {
                !isPatient && <View style={styles.column}>
                    <Text style={styles.title}>Click to view your earnings</Text>
                    <Button mode="contained" onPress={topUp} style={{ marginTop: 10, backgroundColor: configs.colors.danger }}>
                        <Icon5 name="dollar-sign" size={15} color={configs.colors.white} /> Earnings
                    </Button>
                </View>
            }
            <View style={styles.column}>
                <View style={{ backgroundColor: colors.white, borderRadius: 5 }}>
                    <View style={{ marginHorizontal: 5, marginVertical: 10, alignItems: "flex-end" }}>
                        <Text style={styles.title}> {isPatient ? 'Balance' : 'Earnings'}</Text>
                        <Text style={{ color: colors.success, fontWeight: '900', fontSize: 16 }}>UGX. {balance}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },

    textColor: {
        color: '#565151'
    },
    title: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '400'
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 20,
        padding: 0,
        backgroundColor: configs.colors.white,
        borderRadius: 10,
        top: 15
    },
    column: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20,
    },
})

export default TopupCard
