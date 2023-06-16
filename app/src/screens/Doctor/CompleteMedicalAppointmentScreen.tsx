import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, useWindowDimensions, ScrollView, FlatList } from 'react-native'
import * as config from '../../configs'
import { TextInput } from 'react-native-paper'
import Modal from "react-native-modal"
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { Context as DoctorContext } from '../../context/doctorContext'
import { Context as AppContext } from '../../context/appContext'
import { Option, ILabTest, IMedicalHistData } from '../../interfaces'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { renderTable } from '../../components/common/lab/dataTable'
import { CustomAddTestModal, OtherTestsModal, handleAddTest } from '../../components/common/lab/CustomAddTestModal'
import HistoryTabScreen from '../Lab/HistoryScreen'
import { InitialMedicalHistData } from '../../configs/constants'
const numberOfItemsPerPageList = [2, 3, 4]

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
]

const CompleteMedicalAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id, patient } = route.params
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [icd10Codes, setIcd10Codes] = useState<Option[] | any>()
    const [drugs, setDrugs] = useState<Option[]>([])
    const [labTestCategories, setLabTestCategories] = useState<Option[] | any>()
    const [imageTestCategories, setImageTestCategories] = useState<Option[] | any>()

    const [selectedDrugs, setSelectedDrugs] = useState<any>([])
    const [selectedIcdCodes, setSelectedIcdCodes] = useState<ILabTest[]>([])
    const [recordedLabTests, setRecordedLabTests] = useState<ILabTest[]>([])
    const [recordedImageTests, setRecordedImageTests] = useState<ILabTest[]>([])
    const [recordedOtherTests, setRecordedOtherTests] = useState<string>('')
    const [otherTestFindings, setOtherTestFindings] = useState<string>('')

    const [isFetchingIcdCodes, setFetchingIcdCodes] = useState(true)
    const [isFetchingLabTests, setIsFetchingLabTests] = useState(true)
    const [isFetchingImageTests, setIsFetchingImageTests] = useState(true)
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)

    const [page, setPage] = React.useState<number>(0)

    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0])
    const from = page * numberOfItemsPerPage
    const to = Math.min((page + 1) * numberOfItemsPerPage, items.length)

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

    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'tests', title: 'Lab' },
        { key: 'diagnosis', title: 'Diagnosis' },
        { key: 'treatment', title: 'Treatment' },
    ])

    const [historyInfo, setHistoryInfo] = useState<IMedicalHistData>(InitialMedicalHistData)
    const { completeAppointment } = useContext(DoctorContext)

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

        const [selectedLabTestItem, setSelectedLabTestItem] = useState<any>()
        const [selectedImageTestItem, setSelectedImageTestItem] = useState<any>()

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
                    modalTitle={"Enter other tests information conducted"}
                    isVisible={isotherTestModalVisible}
                    toggleModal={toggleOtherTestModal}
                    otherTests={recordedOtherTests}
                    setOtherTests={setRecordedOtherTests}
                    otherTestFindings={otherTestFindings}
                    setOtherTestFindings={setOtherTestFindings} />

            </React.Fragment>
        )
    }

    const DiagnosisScreen = () => (
        <SafeAreaView style={[config.styles.registration.doctor.container, { marginHorizontal: 10 }]}>
            <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
                <Text style={styles.labelTxt}>Select ICD-10 Code</Text>
                {/* <SingleSearchableDropdown
                    items={icd10Codes}
                    placeholderStr="Select ICD10 Code"
                    textInputStr="ICD10 Code"
                    onItemSelect={onSelectICDCode}
                    onRemoveItem={onRemoveICDCode}
                /> */}
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Additional comments<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    label="Additional comments"
                    value={historyInfo.presenting_complaint}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, presenting_complaint: text }))} />
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
                {/* <SingleSearchableDropdown
                    items={drugs}
                    placeholderStr="Select prescription drug"
                    textInputStr="Prescription drugs"
                    onItemSelect={onSelectDrug}
                    onRemoveItem={onRemoveDrug}
                /> */}
            </View>

            <View style={styles.viewContainer}>
                <Text style={styles.labelTxt}>Treatment Plan/Management<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    label="Treatment plan or management"
                    placeholder="Treatment plan or management"
                    value={historyInfo.presenting_complaint}
                    mode="outlined"
                    activeOutlineColor={config.colors.primary}
                    style={styles.textInput}
                    textColor={config.colors.dark}
                    onChangeText={text => setHistoryInfo(prev => ({ ...prev, presenting_complaint: text }))}
                />
            </View>
        </SafeAreaView>
    )

    const renderScene = SceneMap({
        history: () => <HistoryTabScreen historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} />,
        tests: TestsScreen,
        diagnosis: DiagnosisScreen,
        treatment: TreatmentScreen
    })

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            renderLabel={({ route, focused }) => (
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

    infoText: {
        color: config.colors.red,
        textAlign: 'center'
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
    },

    bottomBtn: {
        bottom: 0,
        position: 'absolute',
        width: '98%',
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5
    }
})