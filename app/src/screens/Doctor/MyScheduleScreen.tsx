import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react'
import { Text, SafeAreaView, RefreshControl, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { DataTable, Divider, Button } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { convertFrom24HrTime, displayMessage } from '../../components/common/SharedHelper'
import * as config from '../../configs'
import { Context as AuthContext } from '../../context/authContext'
import { Context as DoctorContext } from '../../context/doctorContext'
import { DoctorCalendar } from '../../interfaces'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheetHeader } from '../../components/BottomSheetHeader'
import { Calendar } from 'react-native-calendars'
import { BottomRightButton } from '../../components/common/buttons'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import AppDatePicker from '../../components/AppDatePicker'
const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(60, 'days').format(_format)

const MyScheduleScreen = () => {

    const initialState = {
        [_today]: { 'selected': false, 'disabled': false }
    }

    const [schedule, setSchedule] = useState<DoctorCalendar[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState<number | any>(null)
    const [refreshing, setRefreshing] = useState(false)
    const { state } = useContext(AuthContext)
    const { user } = state

    const [startTime, setStartTime] = useState<any>()
    const [endTime, setEndTime] = useState<any>()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [openStartTime, setOpenStartTime] = useState(false)
    const [openEndTime, setOpenEndTime] = useState(false)

    const addScheduleRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['25%', '100%'], [])
    const [markedDates, setMarkedDates] = useState<any>(initialState)

    const { getDoctorsCalendar, submitDoctorSchedule, updateDoctorSchedule, deleteDoctorSchedule } = useContext(DoctorContext)

    useEffect(() => {
        fetchDoctorCalendar()
    }, [])

    const populateCalendar = (data: DoctorCalendar[]) => {
        setSchedule(data)
    }

    const fetchDoctorCalendar = () => {
        getDoctorsCalendar({ onSuccess: populateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
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

    const handleConfirmStartTime = (time: Date) => {
        setOpenStartTime(false)
        setStartDate(time)
        const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        setStartTime(formattedTime)
    }

    const handleConfirmEndTime = (time: Date) => {
        setOpenEndTime(false)
        setEndDate(time)
        const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        setEndTime(formattedTime)
    }

    const submitSchedule = () => {

        const selectedCalendarDates = Object.keys(markedDates).filter((date) => markedDates[date].selected)
        if (selectedCalendarDates.length < 1) {
            displayMessage(`Please select at least one date`)
            return
        }
        if (!startTime) {
            displayMessage(`Please select start time`)
            return
        }
        if (!endTime) {
            displayMessage(`Please select end time`)
            return
        }

        const payload = {
            doctor_id: user.id,
            dates: selectedCalendarDates,
            start_time: startTime,
            end_time: endTime
        }
        setIsLoading(true)

        if (isUpdatingSchedule) {
            if (selectedRowId) {
                updateDoctorSchedule({ id: selectedRowId, payload: payload, onSuccess: updateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
            } else {
                displayMessage('System is unable to get selected schedule to update')
            }
        } else {
            submitDoctorSchedule({ payload: payload, onSuccess: updateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
        }
    }

    const updateCalendar = (message: string) => {
        handleClosePress()
        displayMessage(message)
        setMarkedDates(initialState)
        setStartTime("")
        setEndTime("")
        setIsUpdatingSchedule(false)
        setSelectedRowId(null)
        fetchDoctorCalendar()
    }

    const confirmDelete = (item: any) => {
        Alert.alert(
            `Confirm deletion`,
            `Are you sure you want to remove your availability on ${item.date}`,
            [
                {
                    text: 'No', onPress: () => { }
                },
                {
                    text: 'Yes', onPress: async () => {
                        setIsLoading(true)
                        deleteDoctorSchedule({ id: item.id, onSuccess: updateCalendar, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    const onSelectScheduleRow = (item: any) => {
        Alert.alert(
            `Select Action`,
            `Please select action for the scheduled date ${item.date}`,
            [
                {
                    text: 'Cancel', onPress: async () => {
                        setSelectedRowId(null)
                    }
                },
                {
                    text: 'Edit', onPress: () => {
                        setIsUpdatingSchedule(true)
                        setSelectedRowId(item.id)
                        const updatedMarkedDates = { ...{ [item.date]: { 'selected': true } } }
                        setMarkedDates(updatedMarkedDates)
                        setStartTime(item.start_time)
                        setEndTime(item.end_time)
                        handleSnapPress(1)
                    }
                },
                {
                    text: 'Delete', onPress: async () => {
                        confirmDelete(item)
                    }
                },

            ],
            { cancelable: false }
        )
    }

    const renderRow = ({ item }: { item: any }) => (
        <DataTable.Row onPress={() => onSelectScheduleRow(item)}>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{item.date}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{convertFrom24HrTime(item.start_time)}</Text></DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}><Text style={styles.cellText}>{convertFrom24HrTime(item.end_time)}</Text></DataTable.Cell>
        </DataTable.Row>
    )

    const renderHeader = () => (
        <DataTable.Header style={styles.tableHead}>
            <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Date</Text></DataTable.Title>
            <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>Start Time</Text></DataTable.Title>
            <DataTable.Title style={styles.tableCell}><Text style={styles.rowHeaderText}>End Time</Text></DataTable.Title>
        </DataTable.Header>
    )


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

    const renderFooter = () => (
        schedule && schedule.length > 0 ?
            <View style={{ paddingVertical: 20, backgroundColor: config.colors.silver }}>
                <Text style={{ color: config.colors.primaryBlue, fontWeight: '400', textAlign: 'center' }}>*Click on added date to update or delete time frame</Text>
            </View> : null
    )

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
                {renderHeader()}

                <FlatList
                    data={schedule}
                    renderItem={renderRow}
                    keyExtractor={(item: DoctorCalendar, index: number) => item.id.toString()}
                    ListEmptyComponent={!isLoading ? EmptyComponent : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                    ListFooterComponent={renderFooter}
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

                    <SetTimeButton time={startTime} buttonText={'Start Time'} onPress={() => setOpenStartTime(true)} />
                    <SetTimeButton time={endTime} buttonText={'End Time'} onPress={() => setOpenEndTime(true)} />

                    <AppDatePicker mode={"time"} title={"Select start time"} open={openStartTime} setOpen={setOpenStartTime} date={startDate} handleConfirm={handleConfirmStartTime} />
                    <AppDatePicker mode={"time"} title={"Select end time"} open={openEndTime} setOpen={setOpenEndTime} date={endDate} handleConfirm={handleConfirmEndTime} />

                </BottomSheetScrollView>

                <TouchableOpacity onPress={() => submitSchedule()}
                    style={[config.styles.primaryBtn, { alignSelf: 'center', bottom: 20 }]}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>{isUpdatingSchedule ? 'Update' : 'Submit'}</Text>
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
        backgroundColor: config.colors.white
    },

    emptyListStyle: {
        paddingTop: 20,
        fontSize: 17,
        textAlign: 'center',
    },

    tableHead: {
        backgroundColor: config.colors.primary
    },

    tableCell: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    cellText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },

    rowHeaderText: {
        color: config.colors.white,
        textTransform: 'uppercase',
        fontSize: config.fonts.normal
    },


    emptyCalendarView: {
        justifyContent: 'center',
        alignItems: 'center'
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