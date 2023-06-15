import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, KeyboardAvoidingView, View, Text, TouchableOpacity, Button, StatusBar, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import * as config from '../../configs'
import { TextInput, DataTable, Portal, PaperProvider } from 'react-native-paper'
import Modal from "react-native-modal"
import AppLoader from '../../components/AppLoader'
import { formatDate, displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Context as AppContext } from '../../context/appContext'
import { Option, MedicalHistoryRecord } from '../../interfaces'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import CustomSearchableDropdown from '../../components/CustomSearchableDropdown'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
const numberOfItemsPerPageList = [2, 3, 4];

const items = [
    {
        key: 1,
        name: 'Page 1',
    },
    {
        key: 2,
        name: 'Page 2',
    },
    {
        key: 3,
        name: 'Page 3',
    },
];

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, patient, medical_history } = route.params
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [icd10Codes, setIcd10Codes] = useState<Option[] | any>()
    const [drugs, setDrugs] = useState<Option[]>([])
    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>()
    const [imageTestCategories, setImageTestCategories] = useState<Option[] | any>()

    const [selectedDrugs, setSelectedDrugs] = useState<any>([])
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<any>([])
    const [selectedLabTests, setSelectedLabTests] = useState<any>([])
    const [selectedImageTests, setSelectedImageTests] = useState<any>([])

    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingImageTests, setIsFetchingImageTests] = useState(true)
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)

    const [page, setPage] = React.useState<number>(0);

    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const { getIcd10Codes, getLabTestCategories, getImageTestCategories } = useContext(DoctorContext)
    const { getDrugs } = useContext(AppContext)

    useEffect(() => {
        getDrugs({ onSuccess: populateDrugs, onFailure: displayMessage, onCompletion: () => setFetchingDrugs(false) })
        getIcd10Codes({ onSuccess: populateIcd10Codes, onFailure: displayMessage, onCompletion: () => setFetchingIcdCodes(false) })
        getLabTestCategories({ onSuccess: populateLabCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingLabTests(false) })
        getImageTestCategories({ onSuccess: populateImageCategories, onFailure: displayMessage, onCompletion: () => setIsFetchingImageTests(false) })
    }, [])

    const populateDrugs = (drugs: Option[]) => {
        setDrugs(drugs)
    }

    const populateIcd10Codes = (data: Option[]) => {
        setIcd10Codes(data)
    }

    const populateLabCategories = (data: Option[]) => {
        setLabTestCategories(data)
    }

    const populateImageCategories = (data: Option[]) => {
        setImageTestCategories(data)
    }

    // ICD-10 Codes
    const onSelectICDCode = (item: any) => {
        const items = selectedIcdCodes
        items.push(item)
        setSelectedIcdCodes(items)
    }

    const onRemoveICDCode = (item: any) => {
        const items = selectedIcdCodes.filter((sitem: any) => sitem.id !== item.id)
        setSelectedIcdCodes(items)
    }

    // Lab Tests
    const onSelectLabTest = (item: any) => {
        const items = selectedLabTests
        items.push(item)
        setSelectedLabTests(items)
    }

    const onRemoveLabTest = (item: any) => {
        const items = selectedLabTests.filter((sitem: any) => sitem.id !== item.id)
        setSelectedLabTests(items)
    }

    // Image Tests
    const onSelectImageTest = (item: any) => {
        const items = selectedImageTests
        items.push(item)
        setSelectedImageTests(items)
    }

    const onRemoveImageTest = (item: any) => {
        const items = selectedImageTests.filter((sitem: any) => sitem.id !== item.id)
        setSelectedImageTests(items)
    }

    // Prescription drugs
    const onSelectDrug = (item: any) => {
        const items = selectedDrugs
        items.push(item)
        setSelectedDrugs(items)
    }

    const onRemoveDrug = (item: any) => {
        const items = selectedDrugs.filter((sitem: any) => sitem.id !== item.id)
        setSelectedDrugs(items)
    }

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'tests', title: 'Lab' },
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
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>Presenting complaint<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        label="Presenting complaint"
                        value={medical_history.current_treatment}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        disabled={false}
                    />
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>Past medical history<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        value={medical_history.past_medical_history}
                        mode="outlined"
                        label="Past medical history"
                        placeholder="Past medical history can include patient current treatment"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        disabled={false}
                    />
                </View>
                <View style={styles.viewContainer}>
                    <Text style={styles.labelTxt}>Drug allergies<Text style={config.styles.registration.doctor.required}>*</Text></Text>
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

                <View style={[config.styles.bottomFooter, { paddingHorizontal: 5, left: 15 }]}>
                    <Text style={styles.infoText}>*For any mandatory field, if it is not applicable, please enter "None or N/A".</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

    const TestsScreen = () => {
        const [visible, setVisible] = useState(false);
        const showModal = () => setVisible(true);
        const hideModal = () => setVisible(false);

        return (

            <React.Fragment>
                <TouchableOpacity onPress={showModal} style={[config.styles.primaryBtn, { marginTop: 10 }]}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add Tests</Text>
                </TouchableOpacity>

                <View>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Dessert</DataTable.Title>
                            <DataTable.Title numeric>Calories</DataTable.Title>
                            <DataTable.Title numeric>Fat</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
                            <DataTable.Cell numeric>159</DataTable.Cell>
                            <DataTable.Cell numeric>6.0</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>237</DataTable.Cell>
                            <DataTable.Cell numeric>8.0</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
                            <DataTable.Cell numeric>132</DataTable.Cell>
                            <DataTable.Cell numeric>6.0</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>100</DataTable.Cell>
                            <DataTable.Cell numeric>8.0</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                            onPageChange={page => setPage(page)}
                            label={`${from + 1}-${to} of ${items.length}`}
                            showFastPaginationControls
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={numberOfItemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                </View>

                <Modal isVisible={visible} onDismiss={hideModal}>
                    <SafeAreaView style={[config.styles.registration.doctor.container]}>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={hideModal}>
                            <Icon name="times" size={25} color={config.colors.red} />
                        </TouchableOpacity>
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
                                    items={imageTestCategories}
                                    selectedItems={selectedImageTests}
                                    placeholderStr="Image Tests"
                                    textInputStr="Image Tests"
                                    onItemSelect={onSelectImageTest}
                                    onRemoveItem={onRemoveImageTest}
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

                            <TouchableOpacity onPress={showModal} style={[config.styles.primaryBtn, { marginVertical: 10, width: '93%', marginBottom: 40 }]}>
                                <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add Test</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </React.Fragment>


        )
    }

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
                <Text style={styles.labelTxt}>Additional comments<Text style={config.styles.registration.doctor.required}>*</Text></Text>
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

            <View style={[config.styles.bottomFooter, { paddingHorizontal: 5, left: 15 }]}>
                <Text style={styles.infoText}>*For any mandatory field, if it is not applicable, please enter "None or N/A".</Text>
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
                <Text style={styles.labelTxt}>Treatment Plan/Management<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    label="Treatment plan or management"
                    placeholder="Treatment plan or management"
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

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: 25
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
        fontSize: config.fonts.normal
    },

    infoText: {
        color: config.colors.red,
        textAlign: 'center'
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    }
})