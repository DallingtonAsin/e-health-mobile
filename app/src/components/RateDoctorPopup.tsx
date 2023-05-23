import * as config from '../configs'
import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { Rating } from 'react-native-ratings'
import { TextInput } from 'react-native-paper'

const RateDoctorPopup = ({ visible, onClose, onRatingSubmit }: { visible: boolean, onClose: any, onRatingSubmit: any }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const handleRatingSubmit = () => {
        onRatingSubmit(rating, comment)
        setRating(0)
    }

    const onCloseRating = () => {
        setRating(0)
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onCloseRating}
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <Text style={styles.popupText}>Rate the doctor</Text>
                    <Rating
                        showRating
                        startingValue={0}
                        onFinishRating={setRating}
                        imageSize={35}
                        style={styles.rating}
                    />
                    <TextInput
                        editable
                        label={"Comment"}
                        mode="outlined"
                        value={comment}
                        onChangeText={text => setComment(text)}
                        multiline={true}
                        numberOfLines={2}
                        activeOutlineColor={config.colors.yellow}
                        placeholder={""}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCloseRating}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleRatingSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popupContainer: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '70%'
    },
    popupText: {
        fontSize: 18,
        marginBottom: 10,
    },
    rating: {
        paddingVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    submitButton: {
        // backgroundColor: 'blue',
        // padding: 10,
        // borderRadius: 5,
    },
    cancelButton: {
        // backgroundColor: 'red',
        // padding: 10,
        // borderRadius: 5,
        // marginLeft: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
})

export default RateDoctorPopup
