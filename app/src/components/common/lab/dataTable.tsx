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
            : null
    )
}

const renderDrugRow = ({ item, index }: { item: IPrescriptionDrug, index: number }) => {
    const isOddRow = (index: number) => index % 2 === 0;
    const rowStyle = isOddRow(index) ? styles.stripedRow : null;
    return (<DataTable.Row style={rowStyle}>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.name}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.instructions}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.route_of_admin}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.dosage}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.duration}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.quantity}</Text></DataTable.Cell>
    </DataTable.Row>
    )
}

const renderDrugHeader = () => (
    <DataTable.Header style={styles.tableHead}>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Medicine</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Comments</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Route of Admin</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Dosage</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Duration (Days)</Text></DataTable.Title>
        <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Quantity</Text></DataTable.Title>

    </DataTable.Header>
)

const renderDrugTable = (drugs: IPrescriptionDrug[], headerTitle: string) => {
    return (
        drugs && drugs.length > 0 ?
            <ScrollView contentContainerStyle={styles.datatableContainer} horizontal={true}>
                <View style={{ width: 600, paddingHorizontal: 10 }}>
                    <DataTable>
                        <View style={{ alignItems: 'flex-start', marginVertical: 15 }}>
                            <Text style={{ color: config.colors.primaryBlue, textTransform: 'uppercase', fontWeight: '800', fontSize: 14, opacity: 0.8, left: 10 }}>{headerTitle}</Text>
                        </View>
                        {renderDrugHeader()}
                        <FlatList
                            data={drugs}
                            renderItem={renderDrugRow}
                            keyExtractor={(_, index) => index.toString()} />
                    </DataTable>
                </View>
            </ScrollView>
            : null
    )
}

export { renderRow, renderHeader, renderTable, renderDrugRow, renderDrugHeader, renderDrugTable }

const styles = StyleSheet.create({

    tableHead: {
        backgroundColor: config.colors.paleBlue
    },

    tableCell: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },

    cellText: {
        fontSize: 14,
        textTransform: 'capitalize',
        textAlign: 'center',
    },

    rowHeaderText: {
        fontSize: config.fonts.normal,
        color: config.colors.white,
    },

    datatableContainer: {
        flexGrow: 1,
        backgroundColor: config.colors.white,
        marginHorizontal: 15,
        marginVertical: 10
    },
    stripedRow: {
        backgroundColor: '#F2F2F2',
    },
})