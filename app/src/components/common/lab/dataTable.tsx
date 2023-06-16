import React from 'react'
import { View, FlatList, ScrollView, Text, StyleSheet } from 'react-native'
import { DataTable } from 'react-native-paper'
import * as config from '../../../configs'
import { ILabTest, IPrescriptionDrug } from '../../../interfaces'

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
            <ScrollView contentContainerStyle={styles.datatableContainer} horizontal>
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
            </ScrollView>
            : null
    )
}

const renderDrugRow = ({ item }: { item: IPrescriptionDrug }) => (
    <DataTable.Row>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.name}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.instructions}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.route_of_admin}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.dosage}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.duration}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.quantity}</Text></DataTable.Cell>
    </DataTable.Row>
)

const renderDrugHeader = () => (
    <DataTable.Header style={styles.tableHead}>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Name</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Comment</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Route of Admin</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Dosage</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Duration</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Quantity</Text></DataTable.Title>

    </DataTable.Header>
)

const renderDrugTable = (drugs: IPrescriptionDrug[], headerTitle: string) => {
    return (
        drugs && drugs.length > 0 ?
            <ScrollView style={styles.datatableContainer} horizontal={true}>
                <DataTable>
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <Text style={{ color: config.colors.primaryBlue, textTransform: 'uppercase', fontWeight: '800', fontSize: 14, opacity: 0.8 }}>{headerTitle}</Text>
                    </View>
                    {renderDrugHeader()}
                    <FlatList
                        data={drugs}
                        renderItem={renderDrugRow}
                        keyExtractor={(item: any, index: number) => item.id.toString()} />
                </DataTable>
            </ScrollView>
            : null
    )
}

export { renderRow, renderHeader, renderTable, renderDrugRow, renderDrugHeader, renderDrugTable }

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
        flexGrow:1,
        backgroundColor: config.colors.white,
        marginHorizontal: 15,
        marginVertical: 10
    }
})