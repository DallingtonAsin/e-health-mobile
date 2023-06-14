import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { formatDate, displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Context as AppContext } from '../../context/appContext'
import { Option, MedicalHistoryRecord } from '../../interfaces'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import CustomSearchableDropdown from '../../components/CustomSearchableDropdown'

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, patient, medical_history } = route.params
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>();
    const [icd10Codes, setIcd10Codes] = useState<Option[] | any>();
    const [drugs, setDrugs] = useState<Option[]>([]);

    const [selectedLabTests, setSelectedLabTests] = useState<any>([]);
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<any>([]);
    const [selectedDrugs, setSelectedDrugs] = useState<any>([]);


    const { getLabTestCategories, getIcd10Codes } = useContext(DoctorContext);
    const { getDrugs } = useContext(AppContext);

    useEffect(() => {
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) });
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) });
        getDrugs({ onSuccess: populateDrugs, onFailure: displayMessage, onCompletion: () => setFetchingDrugs(false) });
    }, []);

    const populateLabCategories = (data: Option[]) => {
        setLabTestCategories(data)
    }

    const populateIcd10Codes = (data: Option[]) => {
        setIcd10Codes(data)
    }

    const populateDrugs = (drugs: Option[]) => {
        setDrugs(drugs);
    }


    // ICD-10 Codes
    const onSelectICDCode = (item: any) => {
        const items = selectedIcdCodes;
        items.push(item)
        setSelectedIcdCodes(items);
    };

    const onRemoveICDCode = (item: any) => {
        const items = selectedIcdCodes.filter((sitem: any) => sitem.id !== item.id);
        setSelectedIcdCodes(items);
    }

    // Lab Tests
    const onSelectLabTest = (item: any) => {
        const items = selectedLabTests;
        items.push(item)
        setSelectedLabTests(items);
    };

    const onRemoveLabTest = (item: any) => {
        const items = selectedLabTests.filter((sitem: any) => sitem.id !== item.id);
        setSelectedLabTests(items);
    }


    // Prescription drugs
    const onSelectDrug = (item: any) => {
        const items = selectedDrugs;
        items.push(item)
        setSelectedDrugs(items);
    };

    const onRemoveDrug = (item: any) => {
        const items = selectedDrugs.filter((sitem: any) => sitem.id !== item.id);
        setSelectedDrugs(items);
    }

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'tests', title: 'Tests' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const history: MedicalHistoryRecord = {
        id: medical_history.id,
        patient_id: patient.id,
        appointment_id: appointment_id,
        past_medical_history: medical_history.past_medical_history,
        current_treatment: medical_history.current_treatment,
        illness: '',
        diagnosis_date: '',
        treatment: ''
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
        <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Past medical history</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    value={medical_history.past_medical_history}
                    mode="outlined"
                    label="Past medical history"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    disabled={false}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Current treatment</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    label="Current treatment"
                    value={medical_history.current_treatment}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    disabled={false}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Drug allergies
                    <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    label="Drug allergies..."
                    value={historyInfo.illness}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Findings
                    <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    label="Findings..."
                    value={historyInfo.illness}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                />
            </View>
        </SafeAreaView>
    )

    const TestsScreen = () => (
        <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
            <ScrollView
                style={config.styles.registration.doctor.scrollView}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                    <Text style={styles.labelTxt}>Select LabTest</Text>
                    <CustomSearchableDropdown
                        multi={true}
                        items={labTestCategories}
                        selectedItems={selectedLabTests}
                        placeholderStr="Lab Tests"
                        textInputStr="Lab Tests"
                        onItemSelect={onSelectLabTest}
                        onRemoveItem={onRemoveLabTest}
                    />
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>LabTest Findings
                        {/* <Text style={config.styles.registration.doctor.required}>*</Text> */}
                    </Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        label="Lab test findings"
                        value={historyInfo.illness}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        textColor={config.colors.dark}
                        onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                    />
                </View>

                <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                    <Text style={styles.labelTxt}>Select ImageTests</Text>
                    <CustomSearchableDropdown
                        multi={true}
                        items={labTestCategories}
                        selectedItems={selectedLabTests}
                        placeholderStr="Image Tests"
                        textInputStr="Image Tests"
                        onItemSelect={onSelectLabTest}
                        onRemoveItem={onRemoveLabTest}
                    />
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>ImageTest Findings</Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        label="Image test findings"
                        value={historyInfo.illness}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        textColor={config.colors.dark}
                        onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                    />
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>Other Tests</Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        label="Other Tests"
                        value={historyInfo.illness}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        textColor={config.colors.dark}
                        onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                    />
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>Other Test Findings</Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        label="Other test findings"
                        value={historyInfo.illness}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        textColor={config.colors.dark}
                        onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )

    const DiagnosisScreen = () => (
        <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
            <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                <Text style={styles.labelTxt}>Select ICD-10 Code</Text>
                <CustomSearchableDropdown
                    multi={true}
                    items={icd10Codes}
                    selectedItems={selectedIcdCodes}
                    placeholderStr="Select ICD10 Code"
                    textInputStr="ICD10 Code"
                    onItemSelect={onSelectICDCode}
                    onRemoveItem={onRemoveICDCode}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Additional comments</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    label="Additional comments"
                    value={historyInfo.illness}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, illness: text }))}
                />
            </View>
        </SafeAreaView>
    )

    const TreatmentScreen = () => (
        <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
            <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                <Text style={styles.labelTxt}>Select prescription drug(s)</Text>
                <CustomSearchableDropdown
                    multi={true}
                    items={drugs}
                    selectedItems={selectedDrugs}
                    placeholderStr="Select prescription drug"
                    textInputStr="Prescription drugs"
                    onItemSelect={onSelectDrug}
                    onRemoveItem={onRemoveDrug}
                />
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Treatment plan/action(s)</Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    label="Treatment plan"
                    value={historyInfo.treatment}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, treatment: text }))}
                />
            </View>
        </SafeAreaView>
    )

    const renderScene = SceneMap({
        history: HistoryScreen,
        tests: TestsScreen,
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
                <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 20 }]}
                    onPress={() => submit()}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>
            </View>
            {(isLoading || isFetchingLabTests || isFetchingIcdCodes || isFetchingDrugs) && <AppLoader />}
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
        marginHorizontal: 10,
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
        // fontWeight: 'bold',
        fontSize: config.fonts.normal,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
        fontSize: config.fonts.normal
    },
})