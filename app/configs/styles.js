import { Dimensions } from 'react-native';
import {colors} from './colors';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export const styles = {

    primaryBtn: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 2,
        paddingVertical: 15,
        paddingHorizontal: window.width*0.35,
        borderRadius: 5,
        position: 'absolute',
        bottom: 40,
   },

   secondaryBtn: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: window.width*0.35,
    borderRadius: 8,
    position: 'absolute',
    bottom: 40,
},

    btnText: {
        color: colors.primary,
        fontSize: 20,
    },
}