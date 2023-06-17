import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { CustomSingleSelectDropdown } from '../../CustomSearchableDropdown'
import { IPrescriptionDrug, ISelectItem, Option } from '../../../interfaces'
import Modal from "react-native-modal"
import { TextInput } from 'react-native-paper'
import * as config from '../../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { displayMessage } from '../SharedHelper'
import { Context as DoctorContext } from '../../../context/doctorContext'
import { Context as AppContext } from '../../../context/appContext'
import AppLoader from '../../AppLoader'

const TreatmentPlanModal = ({
    isVisible,
    drugInfo,
    setDrugInfo,
    toggleModal,
    setSelectedDrugItem,
    onSubmit
}:
    {
        isVisible: boolean,
        drugInfo: any,
        toggleModal: () => void,
        setSelectedDrugItem: React.Dispatch<React.SetStateAction<string>>,
        setDrugInfo: any,
        onSubmit: () => void
    }) => {


    const [drugs, setDrugs] = useState<any[]>([])
    const [adminRoutes, setAdminRoutes] = useState<Option[] | any>()
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)
    const [isFetchingAdminRoutes, setFetchingAdminRoutes] = useState(true)

    const { getAdministrationRoutes } = useContext(DoctorContext)
    const { getPrescriptionDrugs } = useContext(AppContext)

    const handleDrugItemSelect = (drug: string) => {
        setSelectedDrugItem(drug)
        const updatedDrugInfo: IPrescriptionDrug = {
            ...drugInfo,
            name: drug
        };
        setDrugInfo(updatedDrugInfo)
    }

    const handleAdminRouteItemSelect = (route: string) => {
        const updatedDrugInfo: IPrescriptionDrug = {
            ...drugInfo,
            route_of_admin: route
        };
        setDrugInfo(updatedDrugInfo)
    }

    useEffect(() => {
        getPrescriptionDrugs({ onSuccess: populateDrugs, onFailure: displayMessage, onCompletion: () => setFetchingDrugs(false) })
        getAdministrationRoutes({ onSuccess: populateAdminRoutes, onFailure: displayMessage, onCompletion: () => setFetchingAdminRoutes(false) })
    }, [])

    const populateDrugs = (drugs: ISelectItem[]) => {
        setDrugs(drugs)
    }

    const populateAdminRoutes = (data: ISelectItem[]) => {
        setAdminRoutes(data)
    }

    if (isFetchingDrugs || isFetchingAdminRoutes) {
        return <AppLoader />
    }

    return (
        <React.Fragment>
            <Modal
                isVisible={isVisible}
                onDismiss={toggleModal}
                scrollHorizontal={true}
                avoidKeyboard={true}
                style={{ margin: 10 }} >
                <ScrollView
                    nestedScrollEnabled={true}
                    style={{ marginTop: 0 }}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add prescription drug(s)</Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={toggleModal}>
                            <Icon name="times" size={25} color={config.colors.red} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Select drug</Text>
                            <CustomSingleSelectDropdown
                                data={drugs}
                                setSelected={handleDrugItemSelect}
                                placeholder='Select drug'
                            />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Comments/Instructions</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={3}
                                label={"Comments/Instructions"}
                                value={drugInfo.comments}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, instructions: text }))}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Administration Route</Text>
                            <CustomSingleSelectDropdown
                                data={adminRoutes}
                                setSelected={handleAdminRouteItemSelect}
                                placeholder='Select administartion route'

                            />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Dosage</Text>
                            <TextInput
                                label={"Dosage"}
                                value={drugInfo.dosage}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, dosage: text }))}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Duration</Text>
                            <TextInput
                                label={"Duration"}
                                placeholder='Enter number of days'
                                value={drugInfo.duration.toString()}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, duration: text }))}
                                mode="outlined"
                                keyboardType={'numeric'}
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Quantity</Text>
                            <TextInput
                                label={"Quantity"}
                                placeholder='Enter quantity'
                                value={drugInfo.quantity.toString()}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, quantity: text }))}
                                mode="outlined"
                                keyboardType={'numeric'}
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.infoText}>*Enter None or N/A if not applicable.</Text>
                        </View>

                        <TouchableOpacity onPress={onSubmit} style={[config.styles.primaryBtn, styles.bottomBtn]}>
                            <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>
            {(isFetchingDrugs || isFetchingAdminRoutes) && <AppLoader />}
        </React.Fragment>
    )
}

const handleAddDrug = (
    selectedDrug: string,
    drugInfo: IPrescriptionDrug,
    addedDrugs: IPrescriptionDrug[],
    setAddedDrugs: React.Dispatch<React.SetStateAction<any>>,
    resetDrugInfo: () => void
) => {
    if (!drugInfo.name) {
        displayMessage(`Please select a drug`)
        return
    }
    if (!drugInfo.instructions) {
        displayMessage(`Please enter drug instructions`)
        return
    }
    if (!drugInfo.route_of_admin) {
        displayMessage(`Please select route of administration`)
        return
    }
    if (!drugInfo.dosage) {
        displayMessage(`Please enter drug dosage`)
        return
    }
    if (!drugInfo.duration) {
        displayMessage(`Please enter duration`)
        return
    }
    if (!drugInfo.quantity) {
        displayMessage(`Please enter quantity`)
        return
    }
    const exists = addedDrugs.some((drug: IPrescriptionDrug) => drug.name === selectedDrug)
    if (!exists) {
        const newDrug: IPrescriptionDrug = {
            name: selectedDrug,
            instructions: drugInfo.instructions,
            route_of_admin: drugInfo.route_of_admin,
            dosage: drugInfo.dosage,
            duration: parseInt(drugInfo.duration.toString()),
            quantity: parseInt(drugInfo.quantity.toString())
        }
        setAddedDrugs([...addedDrugs, newDrug])
        resetDrugInfo()
    } else {
        displayMessage(`Drug ${selectedDrug} already added`)
    }
}

export { TreatmentPlanModal, handleAddDrug }

const styles = StyleSheet.create({

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        backgroundColor: config.colors.white
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15
    },

    modalBody: {
        flex: 1,
        marginTop: 15
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeBtn: {
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
    },

    modalViewContainer: {
        marginBottom: 16,
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
        textAlign: 'left',
        top: 20
    },

    bottomBtn: {
        marginTop: 40,
        marginBottom: 40,
        borderWidth: 1,
        borderRadius: 5,
        width: '99%'
    },

    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'blue',
        padding: 16,
    },
})