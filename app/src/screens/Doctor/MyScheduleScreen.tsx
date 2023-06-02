import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react'
import { Text, SafeAreaView, RefreshControl, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { DataTable, Divider, Button, IconButton } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import * as config from '../../configs'
import { Context as AuthContext } from '../../context/authContext'
import { Context as DoctorContext } from '../../context/doctorContext'
import { DoctorCalendar } from '../../interfaces'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheetHeader } from '../../components/BottomSheetHeader'
import { Calendar } from 'react-native-calendars'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-simple-toast'
import { BottomRightButton } from '../../components/common/buttons'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(60, 'days').format(_format)

const MyScheduleScreen = () => {

    const initialState = {
        [_today]: { 'selected': false, 'disabled': false }
    }
    const [schedule, setSchedule] = useState<DoctorCalendar[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const { state } = useContext(AuthContext)
    const user = state.user

    const { getDoctorsCalendar, submitDoctorSchedule } = useContext(DoctorContext)

    const addScheduleRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['25%', '92%'], [])
    const [markedDates, setMarkedDates] = useState<any>(initialState)

    const [startTime, setStartTime] = useState<string>()
    const [endTime, setEndTime] = useState<string>()

    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false)
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false)

    useEffect(() => {
        fetchDoctorCalendar()
    }, [])

    const populateCalendar = (data: DoctorCalendar[]) => {
        setSchedule(data)
    }

    const fetchDoctorCalendar = () => {
        getDoctorsCalendar({ doctor_id: user.id, onSuccess: populateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }

    const onDaySelect = (day: any) => {
        const _selectedDay = moment(day.dateString).format(_format)
        let marked = true
        if (markedDates[_selectedDay]) {
            marked = !markedDates[_selectedDay].selected
        }
        const updatedMarkedDates = { ...markedDates, ...{ [_selectedDay]: { 'selected': marked } } }
        setMarkedDates(updatedMarkedDates)
    }

    const handleSheetChanges = useCallback((index: number) => {
        addScheduleRef.current?.snapToIndex(index)
    }, [])

    const handleSnapPress = useCallback((index: number) => {
        addScheduleRef.current?.snapToIndex(index)
    }, [])

    const handleClosePress = useCallback(() => {
        addScheduleRef.current?.close()
    }, [])

    const setSelectedStartTime = (time: any) => {
        setStartTimePickerVisible(false)
        const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

        setStartTime(formattedTime)
    }

    const setSelectedEndTime = (time: any) => {
        setEndTimePickerVisible(false)
        const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        setEndTime(formattedTime)
    }

    const submitSchedule = () => {

        const selectedCalendarDates = Object.keys(markedDates).filter((date) => markedDates[date].selected)
        if (selectedCalendarDates.length < 1) {
            Toast.show(`Please select at least one date`)
            return
        }
        if (!startTime) {
            Toast.show(`Please select start time`)
            return
        }
        if (!endTime) {
            Toast.show(`Please select end time`)
            return
        }

        const payload = {
            doctor_id: user.id,
            dates: selectedCalendarDates,
            start_time: startTime,
            end_time: endTime
        }
        setIsLoading(true)
        submitDoctorSchedule({ payload: payload, onSuccess: updateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }

    const updateCalendar = (message: string) => {
        handleClosePress()
        displayMessage(message)
        setMarkedDates(initialState)
        setStartTime("")
        setEndTime("")
        fetchDoctorCalendar()
    }

    const CustomDataTable = ({ item }: { item: any }) => (
        <DataTable.Row>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.date}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.start_time}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.end_time}</Text></DataTable.Cell>
        </DataTable.Row>
    )

    const HeaderComponent = () => {
        return (
            <DataTable.Header style={styles.tableHead}>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Date</Text></DataTable.Title>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Start Time</Text></DataTable.Title>
                <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>End Time</Text></DataTable.Title>
            </DataTable.Header>
        )
    }

    const EmptyComponent = () => {
        return (
            <View style={styles.emptyCalendarView}>
                <Text style={styles.emptyListStyle}>Looks like you haven't added any calendar dates</Text>
            </View>
        )
    }

    const CustomCalendar = (props: any) => {
        return (
            <Calendar
                initialDate={_today}
                minDate={_today}
                maxDate={_maxDate}
                onDayPress={onDaySelect}
                markedDates={markedDates}
                disableAllTouchEventsForDisabledDays={true}
                hideArrows={false}
                hideExtraDays={true}
                style={{
                    borderWidth: 0,
                    borderRadius: 4,
                }}
                theme={{
                    todayTextColor: config.colors.primary,
                    selectedDayBackgroundColor: config.colors.primary,
                    selectedDayTextColor: config.colors.white,
                }}
                markingType={'custom'}
            />
        )
    }

    const onRefresh = () => {
        setRefreshing(true)
        fetchDoctorCalendar()
        setRefreshing(false)
    }

    const renderBackDrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} opacity={0.2} />), [])

    const SetTimeButton = ({ time, buttonText, onPress }: { time: any, buttonText: any, onPress: any }) => (
        <View style={styles.buttonView}>
            <Button icon={() => <Icon5 name="clock" color={config.colors.red} />} mode="contained"
                textColor={config.colors.gray} style={{ borderWidth: 0.5, borderColor: config.colors.gray, opacity: 0.9 }}
                buttonColor={config.colors.white} onPress={onPress}>{buttonText}</Button>
            <Text style={styles.time}>{time}</Text>
        </View>
    )

    return (
        <React.Fragment>
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
                <BottomRightButton onPress={() => handleSnapPress(1)} />
            </SafeAreaView>

            <BottomSheet
                ref={addScheduleRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackDrop}
                onChange={handleSheetChanges}
                handleComponent={() => <BottomSheetHeader title='Add schedule' onClose={handleClosePress} />}>
                <Divider style={styles.divider} />

                <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.infoText}>Select one or more days and the timeframe you will be available to take online consultations.</Text>
                    <CustomCalendar onDaySelect={(day: any) => { }} />

                    <SetTimeButton time={startTime} buttonText={'Start Time'} onPress={() => setStartTimePickerVisible(true)} />
                    <SetTimeButton time={endTime} buttonText={'End Time'} onPress={() => setEndTimePickerVisible(true)} />

                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        display='inline'
                        onConfirm={setSelectedStartTime}
                        onCancel={() => setStartTimePickerVisible(false)}
                    />

                    <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        display='inline'
                        onConfirm={setSelectedEndTime}
                        onCancel={() => setEndTimePickerVisible(false)}
                    />

                </BottomSheetScrollView>

                <TouchableOpacity onPress={() => submitSchedule()}
                    style={[config.styles.primaryBtn, { alignSelf: 'center', bottom: 20 }]}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>

            </BottomSheet>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

}

export default MyScheduleScreen

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

    divider: {
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop: 20
    },

    contentContainer: {
        paddingHorizontal: 25,
    },

    buttonView: {
        flexDirection: 'row',
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    time: {
        fontSize: config.fonts.extraLarge,
        fontWeight: '900',
    },

    infoText: {
        fontSize: config.fonts.medium_15,
        textAlign: 'center',
        paddingVertical: 5
    }

})