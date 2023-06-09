import React, { useState, useContext } from 'react'
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { formatDate, displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { MedicalHistoryRecord } from '../../interfaces'
import AppDatePicker from '../../components/AppDatePicker'

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, appointment_number, patient, medical_history } = route.params
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const history: MedicalHistoryRecord = {
        id: medical_history.id,
        patient_id: patient.id,
        appointment_id: appointment_id,
        past_medical_history: medical_history.past_medical_history,
        current_treatment: medical_history.current_treatment,
        illness: '',
        diagnosis_date: '',
        treatment: '',
    }

    const [historyInfo, setHistoryInfo] = useState<MedicalHistoryRecord>(history)
    const { completeAppointment } = useContext(DoctorContext)

    const handleConfirm = (date: Date) => {
        setOpen(false)
        setDate(date)
        const dob = formatDate(date)
        setHistoryInfo({
            ...historyInfo,
            diagnosis_date: dob
        })
    }

    const submit = () => {
        if (!historyInfo.illness) {
            displayMessage("Please enter patient's illness")
            return
        }
        if (!historyInfo.diagnosis_date) {
            displayMessage("Please select diagnosis date")
            return
        }
        if (!historyInfo.treatment) {
            displayMessage("Please enter treatment")
            return
        }

        const payload = {
            patient_id: patient.id,
            illness: historyInfo.illness,
            diagnosis_date: historyInfo.diagnosis_date,
            treatment: historyInfo.treatment
        }
        setIsLoading(true)
        completeAppointment({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const onSuccess = (message: string) => {
        displayMessage(message)
        navigation.navigate('MyAppointments')
    }

    return (
        <React.Fragment>
            <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 12 }]}>
                <StatusBar backgroundColor={config.colors.primary} />
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.disabledView}>
                        <Text style={styles.labelTxt}>Patient Name</Text>
                        <Text style={styles.appointmentNo}>{`${patient.first_name} ${patient.last_name}`}</Text>
                    </View>

                    <View style={styles.disabledView}>
                        <Text style={styles.labelTxt}>Appointment Number.</Text>
                        <Text style={styles.appointmentNo}>#{appointment_number}</Text>
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={styles.labelTxt}>Past Medical History</Text>
                        <TextInput
                            multiline
                            numberOfLines={2}
                            value={medical_history.past_medical_history}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            disabled={true}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={styles.labelTxt}>Current treatment</Text>
                        <TextInput
                            multiline
                            numberOfLines={2}
                            label="Current Treatment"
                            value={medical_history.current_treatment}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            disabled={true}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={styles.labelTxt}>illness
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={3}
                            label="illness"
                            value={historyInfo.illness}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                        />
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>

                        <View style={config.styles.registration.doctor.inputWrap}>
                            <Text style={styles.labelTxt}>Diagnosis date
                                <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                            <TextInput
                                label="Diagnosis date"
                                value={historyInfo.diagnosis_date}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={config.styles.registration.doctor.textInput}
                                textColor={config.colors.dark}
                                onFocus={() => setOpen(true)}
                                showSoftInputOnFocus={false}
                                onChangeText={text => setHistoryInfo(prev => ({ ...prev, diagnosis_date: text }))}
                            />
                            <AppDatePicker open={open} setOpen={setOpen} date={date} handleConfirm={handleConfirm} />
                        </View>
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={styles.labelTxt}>Treatment
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={3}
                            label="Treatment"
                            value={historyInfo.treatment}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, treatment: text }))}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 0 }]}
                            onPress={() => submit()}>
                            <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default CompleteMedicalAppointmentScreen

const styles = StyleSheet.create({

    disabledView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginBottom: 25
    },

    labelTxt: {
        fontSize: 16,
        color: config.colors.black
    },

    appointmentNo: {
        fontWeight: 'bold'
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
})