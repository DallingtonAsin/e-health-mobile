import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native'
import { SingleSearchableDropdown } from '../../CustomSearchableDropdown'
import { IPrescriptionDrug, Option } from '../../../interfaces'
import Modal from "react-native-modal"
import { TextInput } from 'react-native-paper'
import * as config from '../../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { displayMessage } from '../SharedHelper'
import { Context as DoctorContext } from '../../../context/doctorContext'
import { Context as AppContext } from '../../../context/appContext'
import AppLoader from '../../AppLoader'

const TreatmentPlanModal = ({
    selectedDrugItem,
    isVisible,
    drugInfo,
    setDrugInfo,
    toggleModal,
    handleDrugItemSelect,
    onSubmit,
    selectedAdminRoute,
    handleAdminRouteSelect
}:
    {
        selectedDrugItem: Option,
        isVisible: boolean,
        drugInfo: any,
        toggleModal: () => void,
        handleDrugItemSelect: (item: any) => void,
        setDrugInfo: any,
        onSubmit: () => void,
        selectedAdminRoute: Option,
        handleAdminRouteSelect: (item: any) => void
    }) => {


    const [drugs, setDrugs] = useState<Option[]>([])
    const [adminRoutes, setAdminRoutes] = useState<Option[] | any>()
    const [isFetchingDrugs, setFetchingDrugs] = useState(true)
    const [isFetchingAdminRoutes, setFetchingAdminRoutes] = useState(true)

    const { getAdministrationRoutes } = useContext(DoctorContext)
    const { getDrugs } = useContext(AppContext)

    useEffect(() => {
        getDrugs({ onSuccess: populateDrugs, onFailure: displayMessage, onCompletion: () => setFetchingDrugs(false) })
        getAdministrationRoutes({ onSuccess: populateAdminRoutes, onFailure: displayMessage, onCompletion: () => setFetchingAdminRoutes(false) })
    }, [])

    const populateDrugs = (drugs: Option[]) => {
        setDrugs(drugs)
    }

    const populateAdminRoutes = (data: Option[]) => {
        setAdminRoutes(data)
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Modal
                    isVisible={isVisible}
                    onDismiss={toggleModal}
                    scrollHorizontal={true}
                    avoidKeyboard={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add prescription drug(s)</Text>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={toggleModal}>
                                <Icon name="times" size={25} color={config.colors.red} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 5, marginTop: 30 }}>
                            <View>
                                <Text style={styles.labelTxt}>Select presription drug</Text>
                                <SingleSearchableDropdown
                                    selectedItem={selectedDrugItem}
                                    items={drugs}
                                    placeholderStr={"Select presription drug..."}
                                    textInputStr={"Select presription drug..."}
                                    onItemSelect={handleDrugItemSelect}
                                    defaultIndex={selectedDrugItem ? selectedDrugItem.id - 1 : 0}
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
                                <SingleSearchableDropdown
                                    selectedItem={selectedAdminRoute}
                                    items={adminRoutes}
                                    placeholderStr={"Select administration route..."}
                                    textInputStr={"Select administration route..."}
                                    onItemSelect={handleAdminRouteSelect}
                                    defaultIndex={selectedAdminRoute ? selectedAdminRoute.id - 1 : 0}
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

                                <Text style={styles.infoText}>*Enter None or N/A if not applicable.</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={onSubmit} style={[config.styles.primaryBtn, styles.bottomBtn]}>
                            <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {(isFetchingDrugs || isFetchingAdminRoutes) && <AppLoader />}
            </KeyboardAvoidingView>
        </>
    )
}

const handleAddDrug = (
    selectedDrug: Option,
    drugInfo: any,
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
    const exists = addedDrugs.some((drug: IPrescriptionDrug) => drug.id === selectedDrug.id)
    if (!exists) {
        const newDrug: IPrescriptionDrug = {
            id: parseInt(selectedDrug.id.toString()),
            name: selectedDrug.name,
            instructions: drugInfo.instructions,
            route_of_admin: drugInfo.route_of_admin,
            dosage: drugInfo.dosage,
            duration: parseInt(drugInfo.duration.toString()),
            quantity: parseInt(drugInfo.quantity.toString())
        }
        setAddedDrugs([...addedDrugs, newDrug])
        resetDrugInfo()
    } else {
        displayMessage(`Drug ${selectedDrug.name} already added`)
    }
}

export { TreatmentPlanModal, handleAddDrug }

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: 25
    },

    viewContainer: {
        marginVertical: 5,
        paddingHorizontal: 10
    },

    modalViewContainer: {
        marginVertical: 5
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
        bottom: 0,
        position: 'absolute',
        width: '98%',
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5
    }
})