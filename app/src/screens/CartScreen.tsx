import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Drug } from '../interfaces';
import { incrementQuantity, decrementQuantity, removeFromCart, selectCart } from '../redux/features/drugs/drugsSlice';
import * as config from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { CartIncrementButton, CartDecrementButton } from './common';


function CartScreen({ navigation }: { navigation: any }) {

    const cart = useSelector(selectCart);
    const totalQuantity = cart.reduce((total: number, item: Drug) => total + item.quantity, 0);
    const totalCost = cart.reduce((cost: number, item: Drug) => cost + (item.quantity * item.price), 0);

    const dispatch = useDispatch();

    const handleCheckout = () => {
        Alert.alert('Checkout!');
    };

    const incrementQty = (item: Drug) => {
        dispatch(incrementQuantity(item));
    };

    const decrementQty = (item: Drug) => {
        dispatch(decrementQuantity(item));
    };

    const handleRemoveItem = (item: Drug) => {
        dispatch(removeFromCart(item));
    };

    const renderItem = ({ item }: { item: Drug }) => (
        <View
            style={{
                flexDirection: 'column',
                padding: 10,
                marginVertical: 5,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                backgroundColor: config.colors.white,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.formatted_price}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                    <Text style={{ color: config.colors.orange, textTransform: 'uppercase', fontSize: 12 }}><Icon5 name="trash-alt" size={20} color={config.colors.orange} />  Remove</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <CartDecrementButton onPress={() => { decrementQty(item) }} />
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <CartIncrementButton onPress={() => { incrementQty(item) }} />
                </View>
            </View>

        </View>
    );

    const CartHeader = () => (
        <View>
            <Text style={{ textTransform: 'uppercase' }}> cart summary</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: config.colors.white, padding:12 }}>
                <Text style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Subtotal</Text>
                <Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>UGX {totalCost}</Text>
            </View>
            <Text style={{ textTransform: 'uppercase', left:10 }}>Cart ({totalQuantity})</Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: config.colors.light }}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
                ListHeaderComponent={<CartHeader />}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: config.colors.primary,
                    padding: 10,
                    borderRadius: 5,
                    margin: 10,
                    alignItems: 'center',
                }}
                onPress={handleCheckout}
            >
                <Text style={{ color: 'white', fontSize: 18, textTransform: 'uppercase' }}>Checkout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CartScreen;

const styles = StyleSheet.create({

    quantityText: {
        fontSize: 24,
        marginHorizontal: 10,
        fontWeight: 'normal'
    },
});