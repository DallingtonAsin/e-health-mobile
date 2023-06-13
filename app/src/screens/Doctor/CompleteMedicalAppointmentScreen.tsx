import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { formatDate, displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Option, MedicalHistoryRecord } from '../../interfaces'
import AppDatePicker from '../../components/AppDatePicker'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import SearchableDropdown from 'react-native-searchable-dropdown'

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, appointment_number, patient, medical_history } = route.params
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(false)
    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(false)

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()
    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>();
    const [icd10Codes, setIcd10Codes] = useState<Option[] | any>();
    const [selectedLabTests, setSelectedLabTests] = useState<any>([]);
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<any>([]);

    const { getLabTestCategories, getIcd10Codes } = useContext(DoctorContext);

    useEffect(() => {
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) });
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) });
    }, []);

    const populateLabCategories = (data: Option[]) => {
        setLabTestCategories(data)
    }

    const populateIcd10Codes = (data: Option[]) => {
        setIcd10Codes(data)
    }

    const onSelectICDCode = (item: any) => {
        const items = selectedIcdCodes;
        items.push(item)
        setSelectedIcdCodes(items);
    };

    const onRemoveICDCode = (item: any) => {
        const items = selectedIcdCodes.filter((sitem: any) => sitem.id !== item.id);
        setSelectedIcdCodes(items);
    }

    const onSelectLabTest = (item: any) => {
        const items = selectedLabTests;
        items.push(item)
        setSelectedLabTests(items);
    };

    const onRemoveLabTest = (item: any) => {
        const items = selectedLabTests.filter((sitem: any) => sitem.id !== item.id);
        setSelectedLabTests(items);
    }

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'findings', title: 'Findings' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const data = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
        // Add more options as needed
    ];

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

    const HistoryScreen = () => (
        <React.Fragment>
            <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
                <View style={styles.header}>
                    <View style={styles.disabledView}>
                        <Text style={styles.labelTxt}>Appointment Number.</Text>
                        <Text style={styles.appointmentNo}>#{appointment_number}</Text>
                    </View>
                    <View style={styles.disabledView}>
                        <Text style={styles.labelTxt}>Patient Name</Text>
                        <Text style={styles.appointmentNo}>{`${patient.first_name} ${patient.last_name}`}</Text>
                    </View>
                </View>
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Past Medical History</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            value={medical_history.past_medical_history}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            disabled={true}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Current treatment</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            label="Current Treatment"
                            value={medical_history.current_treatment}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            disabled={true}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

    const FindingsScreen = () => (
        <React.Fragment>
            <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
                <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                    <Text style={styles.labelTxt}>Select LabTest
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                    <SearchableDropdown
                        multi={true}
                        selectedItems={selectedLabTests}
                        onItemSelect={onSelectLabTest}
                        onRemoveItem={onRemoveLabTest}
                        containerStyle={styles.searchableContainerStyle}
                        textInputStyle={styles.searchableTextInputStyle}
                        itemStyle={styles.searchableItemStyle}
                        itemTextStyle={styles.searchableTextStyle}
                        itemsContainerStyle={{ maxHeight: 140 }}
                        items={labTestCategories}
                        placeholder="Select LabTest"
                        resetValue={false}
                        underlineColorAndroid="transparent"
                        textInputProps={{
                            placeholder: "LabTest",
                            underlineColorAndroid: "transparent",
                            style: styles.searchableTextInputPropsStyle,
                            onTextChange: (text: any) => console.log(text)
                        }}
                        listProps={{ nestedScrollEnabled: true }}
                    />
                </View>
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Findings
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            label="Findings"
                            value={historyInfo.illness}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

    const DiagnosisScreen = () => (
        <React.Fragment>
            <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
                <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                    <Text style={styles.labelTxt}>Select ICD-10 Code
                        <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                    <SearchableDropdown
                        multi={true}
                        selectedItems={selectedIcdCodes}
                        onItemSelect={onSelectICDCode}
                        onRemoveItem={onRemoveICDCode}
                        containerStyle={styles.searchableContainerStyle}
                        textInputStyle={styles.searchableTextInputStyle}
                        itemStyle={styles.searchableItemStyle}
                        itemTextStyle={styles.searchableTextStyle}
                        itemsContainerStyle={{ maxHeight: 140 }}
                        items={icd10Codes}
                        placeholder="Select ICD10 Code"
                        resetValue={false}
                        underlineColorAndroid="transparent"
                        textInputProps={{
                            placeholder: "ICD10 Code",
                            underlineColorAndroid: "transparent",
                            style: styles.searchableTextInputPropsStyle,
                            onTextChange: (text: any) => console.log(text)
                        }}
                        listProps={{ nestedScrollEnabled: true }}
                    />
                </View>
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Additional comments
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={6}
                            label="additional comments"
                            value={historyInfo.illness}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                        />
                    </View>

                    <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
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

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

    const TreatmentScreen = () => (
        <React.Fragment>
            <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Prescription Drugs
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={3}
                            label="Prescriptions"
                            value={historyInfo.illness}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Treatment plan/action(s)
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={6}
                            label="Treatment plan"
                            value={historyInfo.treatment}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setHistoryInfo(prev => ({ ...prev, treatment: text }))}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </React.Fragment>
    )

    const renderScene = SceneMap({
        history: HistoryScreen,
        findings: FindingsScreen,
        diagnosis: DiagnosisScreen,
        treatment: TreatmentScreen
    })

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: focused ? config.colors.primary : config.colors.black, fontSize: config.fonts.medium_15, fontWeight: '400' }}>
                    {route.title}
                </Text>
            )}
            indicatorStyle={{ backgroundColor: config.colors.primary }}
            style={{ backgroundColor: config.colors.white }}
        />
    )

    return (
        <React.Fragment>
            <StatusBar backgroundColor={config.colors.primary} />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 0 }]}
                    onPress={() => submit()}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>
            </View>
            {(isLoading) || isFetchingLabTests || isFetchingIcdCodes && <AppLoader />}
        </React.Fragment>
    )
}

export default CompleteMedicalAppointmentScreen

const styles = StyleSheet.create({

    header: {
        backgroundColor: config.colors.white,
        paddingHorizontal: 10,
        shadowColor: config.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 8,
        paddingVertical: 4,
        elevation: 5
    },

    footer: {
        marginHorizontal: 12,
    },

    viewContainer: {
        marginVertical: 5,
    },

    disabledView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },

    labelTxt: {
        fontSize: config.fonts.normal,
        color: config.colors.black
    },

    appointmentNo: {
        fontWeight: 'bold',
        fontSize: config.fonts.normal,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    searchableContainerStyle: {
        paddingHorizontal: 5,
        marginVertical: 10
    },

    searchableTextInputStyle: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },

    searchableItemStyle: {
        padding: 10,
        marginTop: 8,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
    },

    searchableTextStyle: {
        color: '#222'
    },

    searchableTextInputPropsStyle: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    }
})