import { Dimensions } from 'react-native';
import { colors, } from './colors';
import { fonts } from './fonts'

const window = Dimensions.get('window');

export const styles = {

  primaryBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 15,
    width: window.width * 0.90,
    borderRadius: 5,
    alignItems: 'center',
  },

  secondaryBtn: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 12,
    width: window.width * 0.92,
    borderRadius: 8,
    alignItems: 'center',
  },

  bottomizedBtn: {
    position: 'absolute',
    bottom: 35,
  },

  btnText: {
    color: colors.primary,
    fontSize: 20,
  },

  logo: {
    borderColor: colors.white,
    borderWidth: 0,
  },

  userAvatar: {
    backgroundColor: colors.white
  },

  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  image: {
    width: 80,
    height: 80,
    tintColor: colors.gray
  },

  noInfoText: {
    fontSize: fonts.large,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    textAlign: 'center'
  }

} as const;
