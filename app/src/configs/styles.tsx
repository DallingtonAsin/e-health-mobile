import { Dimensions } from 'react-native';
import { colors, } from './colors';
import { fonts } from './fonts'

const window = Dimensions.get('window');

const reusable = {

  button: {
    borderWidth: 2,
    paddingVertical: 12,
    width: window.width * 0.92,
    borderRadius: 5,
  },

}

export const styles = {

  primaryBtn: {
    ...reusable.button,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    alignItems: 'center',

  },

  secondaryBtn: {
    ...reusable.button,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    alignItems: 'center',
  },

  dangerBtn: {
    ...reusable.button,
    backgroundColor: colors.danger,
    borderColor: colors.danger,
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
    tintColor: colors.primary
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
  },

  completedTxt: {
    backgroundColor: colors.confirmedBg,
    color: colors.confirmedColor

  },

  pendingTxt: {
    backgroundColor: colors.pendingBg,
    color: colors.pendingColor
  },

  cancelledTxt: {
    backgroundColor: colors.pink,
    color: colors.white
  }

} as const;
