import { createSlice } from "@reduxjs/toolkit";
import { Drug } from "../../../interfaces";

interface CartState{
  cart: Drug[];
}

const initialState: CartState = {
   cart: []
}

const drugSlice = createSlice({
   name: 'drugs',
   initialState: initialState,
   reducers: {
        addToCart: (state, action) => {
           const itemPresent = state.cart.find((item: Drug) => item.id === action.payload.id);
           if(itemPresent){
              itemPresent.quantity++;
           }else{
             state.cart.push({...action.payload, quantity: 1});
           }
        },
        removeFromCart: (state, action) => {
         const removeFromCart = state.cart.filter((item: Drug) => item.id !== action.payload.id);
         state.cart = removeFromCart;
        },
        incrementQuantity: (state, action) => {
            const itemPresent = state.cart.find((item: Drug) => item.id === action.payload.id);
            if(itemPresent){
                itemPresent.quantity++;
            }
        },
        decrementQuantity: (state, action) =>{
            const itemPresent = state.cart.find((item: Drug) => item.id === action.payload.id);
            if(itemPresent){
                if(itemPresent.quantity == 1){
                    const removeFromCart = state.cart.filter((item: Drug) => item.id !== action.payload.id);
                    state.cart = removeFromCart;
                }else{
                    itemPresent.quantity--;
                }
            }
        }
   }
});

export const { addToCart,  removeFromCart, incrementQuantity, decrementQuantity} = drugSlice.actions;

export const selectCart = (state: any) => state.drugs.cart;

export default drugSlice.reducer;
