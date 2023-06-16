import React from 'react'
import { View, FlatList, Text, StyleSheet } from 'react-native'
import { DataTable } from 'react-native-paper'
import * as config from '../../../configs'
import { ILabTest } from '../../../interfaces'

const renderRow = ({ item }: { item: any }) => (
    <DataTable.Row>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.test}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.findings}</Text></DataTable.Cell>
    </DataTable.Row>
)

const renderHeader = () => (
    <DataTable.Header style={styles.tableHead}>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Test</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Findings</Text></DataTable.Title>
    </DataTable.Header>
)

const renderTable = (tests: ILabTest[], headerTitle: string) => {
    return (
        tests && tests.length > 0 ?
            <View style={styles.datatableContainer}>
                <DataTable>
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <Text style={{ color: config.colors.primaryBlue, textTransform: 'uppercase', fontWeight: '800', fontSize: 14, opacity: 0.8 }}>{headerTitle}</Text>
                    </View>
                    {renderHeader()}
                    <FlatList
                        data={tests}
                        renderItem={renderRow}
                        keyExtractor={(item: any, index: number) => item.id.toString()} />
                </DataTable>
            </View>
            : null
    )
}

export { renderRow, renderHeader, renderTable }

const styles = StyleSheet.create({

    tableHead: {
        // backgroundColor: config.colors.primary
    },

    tableCell: {
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    cellText: {
        fontSize: 14,
        textTransform: 'capitalize',
        textAlign: 'center',
    },

    rowHeaderText: {
        textTransform: 'uppercase',
        fontSize: config.fonts.normal
    },

    datatableContainer: {
        backgroundColor: config.colors.white,
        marginHorizontal: 15,
        marginVertical: 10
    }
})