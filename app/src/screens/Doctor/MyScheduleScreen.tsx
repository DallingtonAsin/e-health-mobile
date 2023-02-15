import React, { useState, useContext, useEffect } from 'react';
import { Text, SafeAreaView, RefreshControl, View, FlatList, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import { displayMessage } from '../../components/common/SharedHelper';
import * as config from '../../configs';
import { Context as AppContext } from '../../context/appContext';
import { DoctorCalendar } from '../../interfaces';

const MyScheduleScreen = () => {

    const [schedule, setSchedule] = useState<DoctorCalendar[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { state, getDoctorsCalendar } = useContext(AppContext);
    const user = state.user;

    useEffect(() => {
        getDoctorsCalendar({ doctor_id: user.id, onSuccess: populateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });
    }, []);

    const populateCalendar = (data: DoctorCalendar[]) => {
        setSchedule(data);
    }

    const HeaderComponent = () => {
        return (
            <DataTable.Header style={styles.tableHead}>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Date</Text></DataTable.Title>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Start Time</Text></DataTable.Title>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>End Time</Text></DataTable.Title>
            </DataTable.Header>
        );
    }

    const EmptyComponent = () => {
        return (
            <View style={styles.emptyCalendarView}>
                <Text style={styles.emptyListStyle}>Looks like you haven't added any calendar dates</Text>
            </View>
        );
    }

    const CustomDataTable = ({ item }: { item: any }) => (
        <DataTable.Row>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.date}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.start_time}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.end_time}</Text></DataTable.Cell>
        </DataTable.Row>
    )

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <HeaderComponent />
                <FlatList
                    data={schedule}
                    renderItem={CustomDataTable}
                    keyExtractor={(item: DoctorCalendar, index: number) => item.id.toString()}
                    ListEmptyComponent={!isLoading ? EmptyComponent : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                />
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )

}

export default MyScheduleScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: config.colors.white,
    },

    emptyListStyle: {
        paddingTop: 20,
        fontSize: 17,
        textAlign: 'center',
    },

    cellText: {
        fontSize: 16,
        color: '#000',
        textTransform: 'capitalize',
        textAlign: 'center',
    },

    rowHeaderText: {
        fontWeight: 'bold',
        color: config.colors.white,
        textTransform: 'uppercase',
        fontSize: config.fonts.normal
    },

    tableCell: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    emptyCalendarView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    tableHead: {
        backgroundColor: config.colors.primary
    }

});