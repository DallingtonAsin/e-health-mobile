import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { CustomSingleSelectDropdown } from '../../customSelectDropdowns'
import { ILabTest, ISelectItem } from '../../../interfaces'
import Modal from "react-native-modal"
import { TextInput } from 'react-native-paper'
import * as config from '../../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { displayMessage } from '../SharedHelper'

const CustomAddTestModal = ({
    items,
    isVisible,
    findingsText,
    modalTitle,
    selectTitle,
    findingsTitle,
    textInputLabel,
    toggleModal,
    handleBackdropPress,
    handleItemSelect,
    setFindingsText,
    onSubmit,
}:
    {
        items: ISelectItem[],
        isVisible: boolean,
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
            style={{ marginTop: 0 }}
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

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{ marginTop: 0 }}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.modalViewContainer}>
                        <Text style={styles.labelTxt}>{selectTitle}</Text>
                        <CustomSingleSelectDropdown
                            data={items}
                            setSelected={handleItemSelect}
                            placeholder='Select test'
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

                    <TouchableOpacity onPress={onSubmit} style={[config.styles.primaryBtn, styles.bottomBtn]}>
                        <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                    </TouchableOpacity>
                </ScrollView>
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

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{ marginTop: 0 }}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.modalViewContainer}>
                        <Text style={styles.labelTxt}>Other Tests</Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            label="Other Tests"
                            value={otherTests}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text: string) => setOtherTests(text)}
                        />
                    </View>

                    <View style={styles.modalViewContainer}>
                        <Text style={styles.labelTxt}>Other Test Findings</Text>
                        <TextInput
                            multiline
                            numberOfLines={6}
                            label="Other test findings"
                            value={otherTestFindings}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => setOtherTestFindings(text)}
                        />
                    </View>

                    <TouchableOpacity style={[config.styles.primaryBtn, styles.bottomBtn]}>
                        <Text style={[config.styles.btnText, { color: config.colors.white }]}>Add</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    )
}

const handleAddTest = (
    selectedTest: string,
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
    const exists = addedTests.some((labTest: ILabTest) => labTest.name === selectedTest)
    if (!exists) {
        const newTest = {
            name: selectedTest,
            findings: labFindings
        }
        setAddedTests([...addedTests, newTest])
        resetFindings
    } else {
        displayMessage(`Test ${selectedTest} already added`)
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
    bottomBtn: {
        bottom: 0,
        position: 'absolute',
        width: '98%',
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5
    },
})