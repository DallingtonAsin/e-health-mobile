import React, { useCallback, useMemo, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { BottomSheetHeader } from '../../components/BottomSheetHeader';
import * as config from '../../configs';
import { displayMessage, numberWithCommas } from '../../components/common/SharedHelper';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import { selectCart } from '../../redux/reducers/drugsSlice';
import { Context as AuthContext } from '../../context/authContext';


const Checkout = ({ checkoutCartRef, amount }: { checkoutCartRef: any, amount: number }) => {

    const snapPoints = useMemo(() => ['25%', '75%'], []);
    const { state } = useContext(AuthContext);
    const user = state.user;
    const [phoneNumber, setPhoneNumber] = useState(`${user.country_code}${user.phone_number}`);
    const cart = useSelector(selectCart);

    const handleSheetChanges = useCallback((index: number) => {
        checkoutCartRef.current?.snapToIndex(index)
    }, []);

    const handleClosePress = useCallback(() => {
        checkoutCartRef.current?.close();
    }, []);

    const renderBackDrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} opacity={0.2} />), []);

    const makePayment = () => {
        displayMessage('Coming soon...');
    }

    return (
        <BottomSheet
            ref={checkoutCartRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackDrop}
            onChange={handleSheetChanges}
            handleComponent={() => <BottomSheetHeader title='CHECKOUT' onClose={handleClosePress} />}>
            <Divider style={styles.divider} />

            <View style={styles.body}>
                <Text style={styles.paymentAmount}>Amount to Pay:<Text style={styles.currencyText}> UGX {numberWithCommas(amount)}</Text></Text>
                <TextInput
                    label="Enter phone number"
                    mode='outlined'
                    activeOutlineColor={config.colors.primary}
                    style={styles.phoneInput}
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>

            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <TouchableOpacity
                    style={[config.styles.primaryBtn, { marginBottom: 40 }]}
                    onPress={() => makePayment()}
                >
                    <Text style={config.styles.primaryBtnText}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}


export default Checkout;

const styles = StyleSheet.create({

    contentContainer: {
        paddingHorizontal: 25,
    },

    body: {
        marginVertical: 20,
        marginHorizontal: 15,
        justifyContent: 'space-between'
    },

    divider: {
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop: 20
    },

    paymentAmount: {
        fontSize: 20,
        // fontWeight: 'bold',
        textAlign: 'left'
    },

    phoneInput: {
        marginTop: 20,
        backgroundColor: config.colors.white
    },

    currencyText: {
        color: config.colors.primary
    }

});