import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { Text, SafeAreaView, RefreshControl, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable, Divider } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import { displayMessage, getCurrentDate } from '../../components/common/SharedHelper';
import * as config from '../../configs';
import { Context as AppContext } from '../../context/appContext';
import { DoctorCalendar } from '../../interfaces';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetHeader } from '../../components/BottomSheetHeader';
import { Calendar } from 'react-native-calendars';


const MyScheduleScreen = () => {

    const [schedule, setSchedule] = useState<DoctorCalendar[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const { state, getDoctorsCalendar } = useContext(AppContext);
    const user = state.user;

    const addScheduleRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '75%'], []);
    const currentDate = getCurrentDate();

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
    );

    const CustomCalendar = (props: any) => {

        const marked = useMemo(() => ({
            [currentDate]: { selected: false, selectedColor: config.colors.white, selectedTextColor: config.colors.gray, },
            [selectedDate]: {
              selected: true,
              selectedColor: config.colors.primary,
              selectedTextColor: config.colors.white,
            }
          }), [selectedDate]);

        return (
          <Calendar
            initialDate={''}
            minDate={currentDate}
            markedDates={marked}
            onDayPress={(day) => {
                setSelectedDate(day.dateString);
                props.onDaySelect && props.onDaySelect(day);
              }}
            disableAllTouchEventsForDisabledDays={true}
            hideArrows={false}
            {...props}
          />
        );
      }

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    const renderBackDrop = useCallback((props: any) => ( <BottomSheetBackdrop {...props} opacity={0.2}/>),[]);

    const CircleButton = ({ onPress }: { onPress: any }) => (
        <TouchableOpacity onPress={onPress} style={styles.circularButton}>
            <Icon5 name="plus" size={20} color={config.colors.white} />
        </TouchableOpacity>
    );

    const handleSheetChanges = useCallback((index: number) => {
        addScheduleRef.current?.snapToIndex(index)
      }, []);

      const handleSnapPress = useCallback((index: number) => {
        addScheduleRef.current?.snapToIndex(index);
      }, []);

      const handleClosePress = useCallback(() => {
        addScheduleRef.current?.close();
      }, []);

      const submitSchedule = () => {
        console.log(`selected date`, selectedDate);
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
                <CircleButton onPress={() => handleSnapPress(1)} />

                <BottomSheet
                      ref={addScheduleRef}
                      index={-1}
                      snapPoints={snapPoints}
                      enablePanDownToClose={true}
                      backdropComponent={renderBackDrop}
                      onChange={handleSheetChanges}
                      handleComponent={() => <BottomSheetHeader title='Add schedule' onClose={handleClosePress}/> }>
                      
                      <Divider style={styles.divider}/>
                      
                      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                      <CustomCalendar onDaySelect={(day: any) => {}}/>
                      </BottomSheetScrollView>
                      
                      <TouchableOpacity onPress={() => submitSchedule()}
                      style={[config.styles.primaryBtn, {alignSelf: 'center', bottom:20}]}>
                      <Text style={[config.styles.btnText, {color: config.colors.white}]}>Submit</Text>
                      </TouchableOpacity>
                      
                      </BottomSheet>



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
    },

    circularButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: config.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    divider:{
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop:20
      },

      contentContainer: {
        alignItems: 'center'
      },

});