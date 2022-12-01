import { Dimensions } from 'react-native';
import * as colors from './colors';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export const styles = {

    primaryBtn: {
        backgroundColor: colors.default.white,
        borderColor: colors.default.white,
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: window.width*0.35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        bottom: 40,
   },

   secondaryBtn: {
    backgroundColor: colors.default.white,
    borderColor: colors.default.primary,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: window.width*0.35,
    borderRadius: 5,
    position: 'absolute',
    bottom: 40,
},

    btnText: {
        color: colors.default.primary,
        fontSize: 20,
    },
}