import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, FlatList, ScrollView } from 'react-native'
import * as config from '../../configs'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Context as AppContext } from '../../context/appContext'
import { Option, ILabTest, IMedicalHistData, IPrescriptionDrug } from '../../interfaces'
import { TabView, SceneMap } from 'react-native-tab-view'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { renderDrugTable, renderTable } from '../../components/common/lab/dataTable'
import { CustomAddTestModal, OtherTestsModal, handleAddTest } from '../../components/common/lab/customAddTestsModals'
import HistoryTabScreen from '../Lab/HistoryScreen'
import { InitialMedicalHistData, dataTablePageItems, initialOption, initialPresDrugState, numberOfItemsPerPageList } from '../../configs/constants'
import { renderTabBar } from '../../components/common/tabView'
import DiagnosisScreen from '../Lab/DiagnosisScreen'
import { TreatmentPlanModal, handleAddDrug } from '../../components/common/lab/TreatmentPlanModal'
import { TextInput } from 'react-native-paper'

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, patient } = route.params
    const [historyInfo, setHistoryInfo] = useState<IMedicalHistData>(InitialMedicalHistData)
    const { completeAppointment } = useContext(DoctorContext)

    const [icd10Codes, setIcd10Codes] = useState<Option[] | any>()

    const [drugs, setDrugs] = useState<Option[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>()
    const [imageTestCategories, setImageTestCategories] = useState<Option[] | any>()

    const [selectedIcdCodes, setSelectedIcdCodes] = useState<Option[]>([])
    const [recordedLabTests, setRecordedLabTests] = useState<ILabTest[]>([])
    const [recordedImageTests, setRecordedImageTests] = useState<ILabTest[]>([])
    const [recordedOtherTests, setRecordedOtherTests] = useState<string>('')
    const [otherTestFindings, setOtherTestFindings] = useState<string>('')
    const [diagnosisComments, setDiagnosisComments] = useState<string>('')
    const [recordedDrugs, setRecordedDrugs] = useState<any>([])
    const [treatmentPlan, setTreatmentPlan] = useState<any>()

    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingImageTests, setIsFetchingImageTests] = useState(true)
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)

    const [page, setPage] = React.useState<number>(0)

    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0])
    const from = page * numberOfItemsPerPage
    const to = Math.min((page + 1) * numberOfItemsPerPage, dataTablePageItems.length)

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

    const onRemoveLabTest = (item: any) => {
        const items = recordedLabTests.filter((sitem: any) => sitem.id !== item.id)
        setRecordedLabTests(items)
    }

    const onRemoveImageTest = (item: any) => {
        const items = recordedImageTests.filter((sitem: any) => sitem.id !== item.id)
        setRecordedImageTests(items)
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

    // prescription drugs
    const onRemovePrescriptionDrug = (item: any) => {
        const items = recordedDrugs.filter((sitem: any) => sitem.id !== item.id)
        setRecordedDrugs(items)
    }

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'tests', title: 'Lab' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const submit = () => {

        if (!historyInfo?.presenting_complaint) {
            displayMessage("Please enter presenting complaint")
            return
        }
        if (!historyInfo.past_medical_history) {
            displayMessage("Please enter past medical history")
            return
        }
        if (!historyInfo.drug_allergies) {
            displayMessage("Please enter drug allergies")
            return
        }
        if (!historyInfo.findings) {
            displayMessage("Please enter findings")
            return
        }

        const payload = {
            patient_id: patient.id,
            presenting_complaint: historyInfo.presenting_complaint,
            past_medical_history: historyInfo.past_medical_history,
            drug_allergies: historyInfo.drug_allergies,
            findings: historyInfo.findings
        }
        setIsLoading(true)
        completeAppointment({ appointment_id: appointment_id, payload: payload, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const onSuccess = (message: string) => {
        displayMessage(message)
        navigation.navigate('MyAppointments')
    }

    const TestsScreen = () => {

        const [selectedLabTestItem, setSelectedLabTestItem] = useState<Option>(initialOption)
        const [selectedImageTestItem, setSelectedImageTestItem] = useState<Option>(initialOption)

        const [labTestFindings, setLabTestFindings] = useState('')
        const [imageTestFindings, setImageTestFindings] = useState('')

        const [isLabTestModalVisible, setIsLabTestModalVisible] = useState(false)
        const [isImageTestModalVisible, setIsImageTestModalVisible] = useState(false)
        const [isotherTestModalVisible, setIsOtherTestModalVisible] = useState(false)

        const toggleLabTestModal = () => setIsLabTestModalVisible(!isLabTestModalVisible)
        const toggleImageTestModal = () => setIsImageTestModalVisible(!isImageTestModalVisible)
        const toggleOtherTestModal = () => setIsOtherTestModalVisible(!isotherTestModalVisible)

        const tests = [
            { id: 1, text: 'Add lab tests', action: toggleLabTestModal },
            { id: 2, text: 'Add image tests', action: toggleImageTestModal },
            { id: 3, text: 'Add other tests', action: toggleOtherTestModal }
        ]

        const handleLabTestItemSelect = (item: any) => {
            setSelectedLabTestItem(item)
        }

        const handleImageTestItemSelect = (item: any) => {
            setSelectedImageTestItem(item)
        }

        const handleBackdropPress = () => {
            setIsLabTestModalVisible(true)
        }

        const renderItem = ({ item }: { item: any }) => (
            <TouchableOpacity style={styles.item} onPress={item.action}>
                <Text style={styles.itemTitle}>{item.text}</Text>
                <Icon5 name="angle-right" size={20} color={config.colors.primary} style={styles.arrow} />
            </TouchableOpacity>
        )

        return (
            <React.Fragment>
                <SafeAreaView style={{ flex: 1 }}>
                    {renderTable(recordedLabTests, 'Lab Tests')}
                    {renderTable(recordedImageTests, 'Image Tests')}
                    <FlatList
                        data={tests}
                        renderItem={renderItem}
                        keyExtractor={(item: any, index: number) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                        style={{ top: 20 }} />
                </SafeAreaView>

                <CustomAddTestModal
                    items={labTestCategories}
                    addedTests={recordedLabTests}
                    selectedItem={selectedLabTestItem}
                    isVisible={isLabTestModalVisible}
                    findingsText={labTestFindings}
                    modalTitle={"Enter labtests carried out"}
                    selectTitle={"Select LabTest"}
                    findingsTitle={"LabTest Findings"}
                    textInputLabel={"Lab test findings"}
                    placeholder={"Lab Tests"}
                    textInputStr={"Lab Tests"}
                    toggleModal={toggleLabTestModal}
                    handleBackdropPress={handleBackdropPress}
                    handleItemSelect={handleLabTestItemSelect}
                    onRemoveItem={onRemoveLabTest}
                    setFindingsText={setLabTestFindings}
                    onSubmit={() => handleAddTest(selectedLabTestItem, labTestFindings, recordedLabTests, setRecordedLabTests, () => setLabTestFindings(''))} />

                <CustomAddTestModal
                    items={imageTestCategories}
                    addedTests={recordedImageTests}
                    selectedItem={selectedImageTestItem}
                    isVisible={isImageTestModalVisible}
                    findingsText={imageTestFindings}
                    modalTitle={"Enter imagetests carried out"}
                    selectTitle={"Select ImageTest"}
                    findingsTitle={"ImageTest Findings"}
                    textInputLabel={"Image test findings"}
                    placeholder={"Image Tests"}
                    textInputStr={"Image Tests"}
                    toggleModal={toggleImageTestModal}
                    handleBackdropPress={handleBackdropPress}
                    handleItemSelect={handleImageTestItemSelect}
                    onRemoveItem={onRemoveImageTest}
                    setFindingsText={setImageTestFindings}
                    onSubmit={() => handleAddTest(selectedImageTestItem, imageTestFindings, recordedImageTests, setRecordedImageTests, () => setImageTestFindings(''))} />

                <OtherTestsModal
                    modalTitle={"Enter other tests information"}
                    isVisible={isotherTestModalVisible}
                    toggleModal={toggleOtherTestModal}
                    otherTests={recordedOtherTests}
                    setOtherTests={setRecordedOtherTests}
                    otherTestFindings={otherTestFindings}
                    setOtherTestFindings={setOtherTestFindings} />

            </React.Fragment>
        )
    }

    const TreatmentScreen = () => {
        const [selectedDrugItem, setSelectedDrugItem] = useState<Option>(initialOption)
        const [isDrugModalVisible, setIsDrugModalVisible] = useState(false)
        const [drugInfo, setDrugInfo] = useState<IPrescriptionDrug>(initialPresDrugState)

        const toggleDrugModal = () => setIsDrugModalVisible(!isDrugModalVisible)

        const handleDrugItemSelect = (item: any) => {
            setSelectedDrugItem(item)
            const updatedDrugInfo: IPrescriptionDrug = {
                ...drugInfo,
                id: parseInt(item.id.toString()),
                name: item.name
            };
            setDrugInfo(updatedDrugInfo)
        }

        return (
            <View>
                <TouchableOpacity style={[styles.item, {marginVertical: 10}]} onPress={toggleDrugModal}>
                    <Text style={styles.itemTitle}>Add prescription drug</Text>
                    <Icon5 name="angle-right" size={20} color={config.colors.primary} style={styles.arrow} />
                </TouchableOpacity>

                {renderDrugTable(recordedDrugs, 'Prescription drugs')}

                <View style={[styles.viewContainer, {backgroundColor: config.colors.white, marginHorizontal:15, padding: 20 }]}>
                    <Text style={styles.labelTxt}>Treatment Plan/Management<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                    <TextInput
                        multiline
                        numberOfLines={6}
                        label="Treatment plan or management"
                        placeholder="Treatment plan or management"
                        value={treatmentPlan}
                        mode="outlined"
                        activeOutlineColor={config.colors.primary}
                        style={styles.textInput}
                        textColor={config.colors.dark}
                        onChangeText={text => setTreatmentPlan(text)}
                    />
                </View>
                <TreatmentPlanModal
                    items={drugs}
                    selectedDrugItem={selectedDrugItem}
                    isVisible={isDrugModalVisible}
                    drugInfo={drugInfo}
                    setDrugInfo={setDrugInfo}
                    toggleModal={toggleDrugModal}
                    handleItemSelect={handleDrugItemSelect}
                    onRemoveItem={onRemovePrescriptionDrug}
                    onSubmit={() => handleAddDrug(selectedDrugItem, drugInfo, recordedDrugs, setRecordedDrugs, () => setDrugInfo(initialPresDrugState))}
                />
            </View>
        )
    }

    const renderScene = SceneMap({
        history: () => <HistoryTabScreen historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} />,
        tests: TestsScreen,
        diagnosis: () => <DiagnosisScreen
            icd10Codes={icd10Codes}
            selectedIcdCodes={selectedIcdCodes}
            onSelectICDCode={onSelectICDCode}
            onRemoveICDCode={onRemoveICDCode}
            comments={diagnosisComments}
            setComments={setDiagnosisComments}
        />,
        treatment: TreatmentScreen
    })

    return (
        <React.Fragment>
            <StatusBar backgroundColor={config.colors.primary} />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }} />
            <View style={styles.footer}>
                <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%', marginBottom: 20 }]}
                    onPress={() => submit()}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Submit</Text>
                </TouchableOpacity>
            </View>
            {(isLoading || isFetchingLabTests || isFetchingIcdCodes || isFetchingDrugs || isFetchingImageTests) && <AppLoader />}
        </React.Fragment>
    )
}

export default CompleteMedicalAppointmentScreen

const styles = StyleSheet.create({

    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
    },

    footer: {
        marginHorizontal: 12,
    },

    labelTxt: {
        fontSize: config.fonts.normal,
        color: config.colors.black
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
        fontSize: config.fonts.normal
    },

    item: {
        shadowColor: config.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: config.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },

    itemTitle: {
        color: '#000',
        fontSize: config.fonts.medium,
    },

    arrow: {
        right: 0
    }
})