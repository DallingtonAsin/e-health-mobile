import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { SingleSearchableDropdown } from '../../CustomSearchableDropdown'
import { ILabTest, Option } from '../../../interfaces'
import Modal from "react-native-modal"
import { TextInput, DataTable } from 'react-native-paper'
import * as config from '../../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { renderHeader, renderRow } from './dataTable'
import { displayMessage } from '../SharedHelper'

const CustomAddTestModal = ({
    items,
    selectedItem,
    isVisible,
    findingsText,
    modalTitle,
    selectTitle,
    findingsTitle,
    textInputLabel,
    placeholder,
    textInputStr,
    toggleModal,
    handleBackdropPress,
    handleItemSelect,
    setFindingsText,
    onSubmit,
}:
    {
        items: Option[],
        selectedItem: Option,
        isVisible: boolean,
        placeholder: string,
        textInputStr: string,
        findingsText: string,
        modalTitle: string,
        selectTitle: string,
        findingsTitle: string,
        textInputLabel: string,
        toggleModal: () => void,
        handleBackdropPress: () => void,
        handleItemSelect: (item: any) => void,
        setFindingsText: any,
        onSubmit: () => void,
    }) => {
    return (
        <Modal
            isVisible={isVisible}
            onDismiss={toggleModal}
            onBackdropPress={handleBackdropPress}
            scrollHorizontal={true}
            avoidKeyboard={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={toggleModal}>
                        <Icon name="times" size={25} color={config.colors.red} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 5, marginTop: 30 }}>
                    <View>
                        <Text style={styles.labelTxt}>{selectTitle}</Text>
                        <SingleSearchableDropdown
                            selectedItem={selectedItem}
                            items={items}
                            placeholderStr={placeholder}
                            textInputStr={textInputStr}
                            onItemSelect={handleItemSelect}
                            defaultIndex={selectedItem ? selectedItem.id - 1 : 0}
                        />
                    </View>

                    <View style={styles.modalViewContainer}>
                        <Text style={styles.labelTxt}>{findingsTitle}</Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            label={textInputLabel}
                            value={findingsText}
                            onChangeText={setFindingsText}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark} />
                    </View>
                </View>

                <TouchableOpacity onPress={onSubmit} style={[config.styles.primaryBtn, styles.bottomBtn]}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const OtherTestsModal = ({
    modalTitle,
    isVisible,
    toggleModal,
    otherTests,
    setOtherTests,
    otherTestFindings,
    setOtherTestFindings
}: {
    modalTitle: string,
    isVisible: boolean,
    toggleModal: () => void,
    otherTests: string,
    setOtherTests: React.Dispatch<React.SetStateAction<string>>,
    otherTestFindings: string,
    setOtherTestFindings: React.Dispatch<React.SetStateAction<string>>,
}) => {
    return (
        <Modal isVisible={isVisible} onDismiss={toggleModal}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={toggleModal}>
                        <Icon name="times" size={25} color={config.colors.red} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Other Tests</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            label="Other Tests"
                            value={otherTests}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text: string) => setOtherTests(text)}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Other Test Findings</Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            label="Other test findings"
                            value={otherTestFindings}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setOtherTestFindings(text)}
                        />
                    </View>
                </View>

                <TouchableOpacity style={[config.styles.primaryBtn, styles.bottomBtn]}>
                    <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const handleAddTest = (
    selectedTest: Option,
    labFindings: string,
    addedTests: ILabTest[],
    setAddedTests: React.Dispatch<React.SetStateAction<any>>,
    resetFindings: () => void
) => {
    if (!selectedTest) {
        displayMessage(`Please select a test`)
        return
    }
    if (!labFindings) {
        displayMessage(`Please enter test findings`)
        return
    }
    const exists = addedTests.some((labTest: ILabTest) => labTest.id === selectedTest.id)
    if (!exists) {
        const newTest = {
            id: selectedTest.id,
            test: selectedTest.name,
            findings: labFindings
        }
        setAddedTests([...addedTests, newTest])
        resetFindings
    } else {
        displayMessage(`Test ${selectedTest.name} already added`)
    }
}

export { CustomAddTestModal, OtherTestsModal, handleAddTest }

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
        paddingHorizontal: 10,
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
    bottomBtn: {
        bottom: 0,
        position: 'absolute',
        width: '98%',
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5
    },
})