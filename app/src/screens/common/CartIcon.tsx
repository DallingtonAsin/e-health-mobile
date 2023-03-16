import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Icon5 from 'react-native-vector-icons/FontAwesome'
import { selectCart } from '../../redux/features/drugs/drugsSlice'
import { Drug } from '../../interfaces';
import * as config from '../../configs';
import { useNavigation } from '@react-navigation/native';


function CartIcon() {

    const navigation = useNavigation();
    const cart = useSelector(selectCart);
    const totalQuantity = cart.reduce((total: number, item: Drug) => total + item.quantity, 0);

    return (
        cart.length > 0 ?
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Cart')}>
                <Icon5 name="shopping-cart" size={30} color={config.colors.gray} />
                {totalQuantity > 0 && (
                    <View style={[config.styles.supCount, { backgroundColor: config.colors.orange }]}>
                        <Text style={{ color: config.colors.white, fontSize: 12 }}>{totalQuantity}</Text>
                    </View>
                )}
            </TouchableOpacity>
            : null
    );
}


export default CartIcon;
