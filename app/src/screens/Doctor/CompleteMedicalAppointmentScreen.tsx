import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage } from '../../components/common/SharedHelper';
import { Context as DoctorContext } from '../../context/doctorContext';
import { MedicalHistoryRecord } from '../../interfaces';
import Toast from 'react-native-simple-toast';


const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, appointment_number, patient, medical_history } = route.params;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const [historyInfo, setHistoryInfo] = useState<MedicalHistoryRecord>(history);
    const { completeAppointment } = useContext(DoctorContext);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        let dob = formatDate(date);
        setHistoryInfo({
            ...historyInfo,
            diagnosis_date: dob
        });
    };

    const submit = () => {
        if (!historyInfo.illness) {
            Toast.show("Please enter patient's illness", Toast.LONG);
            return;
        }
        if (!historyInfo.diagnosis_date) {
            Toast.show("Please select diagnosis date", Toast.LONG);
            return;
        }
        if (!historyInfo.treatment) {
            Toast.show("Please enter treatment", Toast.LONG);
            return;
        }

        const payload = {
            patient_id: patient.id,
            illness: historyInfo.illness,
            diagnosis_date: historyInfo.diagnosis_date,
            treatment: historyInfo.treatment
        }
        setIsLoading(true);
        completeAppointment({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const onSuccess = (message: string) => {
        displayMessage(message);
        navigation.navigate('MyAppointments');
    }

    return (
        <React.Fragment>
            <SafeAreaView style={config.styles.registration.doctor.container}>

                <StatusBar
                    backgroundColor={config.colors.primary}
                />

                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.disabledView}>
                        <Text style={styles.labelTxt}>Appointment No.</Text>
                        <Text style={styles.appointmentNo}>#{appointment_number}</Text>
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={styles.labelTxt}>Patient Name</Text>
                        <TextInput
                            value={`${patient.first_name} ${patient.last_name}`}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={5}
                            style={config.styles.registration.doctor.textInput}
                            disabled={true}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={styles.labelTxt}>Past Medical History</Text>
                        <TextInput
                            multiline
                            numberOfLines={3}
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
                            numberOfLines={3}
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
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={text => setHistoryInfo(prev => ({ ...prev, diagnosis_date: text }))}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                display='inline'
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}

                            />
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
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%', marginBottom: 40 }]}
                            onPress={() => submit()}>
                            <Text style={[config.styles.btnText]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default CompleteMedicalAppointmentScreen;

const styles = StyleSheet.create({

    disabledView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginBottom: 25
    },

    labelTxt: {
        fontSize: 16,
    },

    appointmentNo: {
        fontWeight: 'bold'
    }
});