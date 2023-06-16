import React from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native'
import { SingleSearchableDropdown } from '../../CustomSearchableDropdown'
import { IPrescriptionDrug, Option } from '../../../interfaces'
import Modal from "react-native-modal"
import { TextInput } from 'react-native-paper'
import * as config from '../../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { displayMessage } from '../SharedHelper'

const TreatmentPlanModal = ({
    items,
    selectedDrugItem,
    isVisible,
    drugInfo,
    setDrugInfo,
    toggleModal,
    handleItemSelect,
    onRemoveItem,
    onSubmit,
}:
    {
        items: Option[],
        selectedDrugItem: Option,
        isVisible: boolean,
        drugInfo: any,
        toggleModal: () => void,
        handleItemSelect: (item: any) => void,
        onRemoveItem: (item: any) => void,
        setDrugInfo: any,
        onSubmit: () => void,
    }) => {
    console.log(`drug info`, drugInfo)
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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
                                items={items}
                                placeholderStr={"Select presription drug..."}
                                textInputStr={"Select presription drug..."}
                                onItemSelect={handleItemSelect}
                                onRemoveItem={onRemoveItem}
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
                            <Text style={styles.labelTxt}>Route of admin</Text>
                            <TextInput
                                label={"Route of admin"}
                                value={drugInfo.route_of_admin}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, route_of_admin: text }))}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
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
                                value={drugInfo.duration}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, duration: text }))}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>

                        <View style={styles.modalViewContainer}>
                            <Text style={styles.labelTxt}>Quantity</Text>
                            <TextInput
                                label={"Quantity"}
                                placeholder='Enter quantity'
                                value={drugInfo.quantity}
                                onChangeText={(text: string) => setDrugInfo((prev: IPrescriptionDrug) => ({ ...prev, quantity: text }))}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark} />
                        </View>
                    </View>

                    <View style={[config.styles.bottomFooter, { paddingHorizontal: 5, left: 15 }]}>
                        <Text style={styles.infoText}>*Enter None or N/A if not applicable.</Text>
                    </View>

                    <TouchableOpacity onPress={onSubmit} style={[config.styles.primaryBtn, styles.bottomBtn]}>
                        <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

const handleAddDrug = (
    selectedDrug: Option,
    drugInfo: any,
    addedDrugs: IPrescriptionDrug[],
    setAddedDrugs: React.Dispatch<React.SetStateAction<any>>,
    resetDrugInfo: () => void
) => {
    if (!selectedDrug) {
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
        textAlign: 'center'
    },

    bottomBtn: {
        bottom: 0,
        position: 'absolute',
        width: '98%',
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5
    },
})