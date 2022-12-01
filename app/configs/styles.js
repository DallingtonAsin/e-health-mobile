import {Dimensions} from 'react-native';
import {colors} from './colors';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

export const styles = {
    
  primaryBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 15,
    width: window.width*0.90,
    borderRadius: 5,
    alignItems: 'center',
  },

  secondaryBtn: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 15,
    width: window.width*0.90,
    borderRadius: 8,
    alignItems: 'center',
  },

  bottomizedBtn: {
    position: 'absolute',
    bottom: 40,
  },

  btnText: {
    color: colors.primary,
    fontSize: 20,
  },

  logo: {
    borderColor: colors.white,
    borderWidth: 0,
    overflow: "hidden",
  }
};
