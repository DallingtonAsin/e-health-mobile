import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as configs from '../configs';
import { useSelector, useDispatch } from 'react-redux';
import { CartIncrementButton, CartDecrementButton } from './common';
import { addToCart, incrementQuantity, decrementQuantity, selectCart } from '../redux/features/drugs/drugsSlice';
import { Drug } from '../interfaces';

const DrugDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { drug } = route.params;
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);

    const hasItemInCart = (itemId: number) => cart.some((item: Drug) => item.id === itemId);

    const handleAddToCart = () => {
        dispatch(addToCart(drug));
    };

    const incrementQty = () => {
        dispatch(incrementQuantity(drug));
    };

    const decrementQty = () => {
        dispatch(decrementQuantity(drug));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={configs.styles.registration.doctor.scrollView}
                contentContainerStyle={configs.styles.registration.doctor.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: drug.image }} style={styles.image} />
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{drug.name}</Text>
                    <Text style={styles.description}>{drug.description}</Text>
                    <View style={{ position: 'absolute', top: 3, right: 2, marginVertical: 5 }}>
                        <Text style={[styles.drugStatus, drug.in_stock ? { backgroundColor: configs.colors.success } : { backgroundColor: configs.colors.danger }]}>{drug.status}</Text>
                    </View>
                    <Text style={styles.price}>{drug.formatted_price}</Text>
                </View>

                {drug.in_stock && <View style={styles.footerBtns}>

                    {hasItemInCart(drug.id) &&
                        <View style={styles.quantityContainer}>
                            <CartDecrementButton onPress={decrementQty} />
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <CartIncrementButton onPress={incrementQty} />
                        </View>
                    }

                    {!hasItemInCart(drug.id) &&
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={[configs.styles.primaryBtn, { width: '100%' }]}
                                onPress={handleAddToCart}>
                                <Text style={[configs.styles.btnText, { color: configs.colors.white }]}>Add to cart</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                }

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: configs.colors.light,
    },

    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },

    detailsContainer: {
        padding: 16,
    },

    imageContainer: {
        backgroundColor: configs.colors.white,
        borderRadius: 10,
        overflow: 'hidden',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },

    description: {
        fontSize: 16,
        marginVertical: 8,
    },

    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
        color: configs.colors.primary,
    },

    button: {
        backgroundColor: configs.colors.primary,
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        alignSelf: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    drugStatus: {
        fontSize: 12,
        padding: 3,
        borderRadius: 3,
        right: 0,
        color: configs.colors.white,
        fontWeight: 'bold',
    },

    quantityContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 10,
    },

    quantityButton: {
        width: 40,
        height: 40,
        backgroundColor: configs.colors.orange,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quantityButtonText: {
        fontSize: 24,
        color: configs.colors.white
    },

    quantityText: {
        fontSize: 24,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },

    footerBtns: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default DrugDetailsScreen;
