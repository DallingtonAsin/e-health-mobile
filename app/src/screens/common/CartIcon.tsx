import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Icon5 from 'react-native-vector-icons/FontAwesome'
import { selectCart } from '../../redux/features/drugs/drugsSlice'
import { Drug } from '../../interfaces';
import * as config from '../../configs';


function CartIcon() {

  const cart = useSelector(selectCart);
  const totalQuantity = cart.reduce((total: number, item: Drug) => total + item.quantity, 0);

  return (
    <View style={{ marginLeft: 10 }}>
      <Icon5 name="shopping-cart" size={30} color={config.colors.gray} />
      {totalQuantity > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -7,
            backgroundColor: config.colors.orange,
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          <Text style={{ color: config.colors.white, fontSize: 12 }}>
            {totalQuantity}
          </Text>
        </View>
      )}
    </View>
  );
}


export default CartIcon;
