import { Dimensions } from 'react-native';
import { colors, } from './colors';
import { fonts } from './fonts'

const width = Dimensions.get('window').width;

const reusable = {

  button: {
    borderWidth: 2,
    paddingVertical: 13.5,
    width: width * .92,
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

  footer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  btnText: {
    color: colors.primary,
    fontSize: fonts.large,
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
  },

  searchbar: {
    marginHorizontal: 16,
    marginVertical: 5,
    paddingVertical: 0,
    backgroundColor: colors.white,
  },

  searchbarInput: {
    fontSize: fonts.large,
  },

  registration: {

    doctor: {
      container: {
        flex: 1,
        backgroundColor: colors.white,
        marginVertical: 10,
        marginHorizontal: 6,
        elevation: 8,
        borderRadius: 8,
        shadowColor: colors.gray,
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
      },

      scrollView: {
        flex: 1,
      },

      scrollContainer: {
        flexGrow: 1,
        margin: 15,
      },

      inputWrap: {
        flex: 1,
        paddingHorizontal: 5,
      },

      labelTxt: {
        fontSize: 18,
      },

      viewContainer: {
        flex: 1,
        marginVertical: 5,
      },

      title: {
        marginVertical: 10,
        textAlign: 'center',
        fontSize: fonts.extraLarge,
        fontWeight: '800',
        textTransform: 'uppercase',
      },

      back2Login: {
        alignItems: 'center',
        paddingBottom: 20,
      },

      back2LoginTxt: {
        color: colors.primary,
        fontSize: 18,
        textAlign: 'center',
      },

      required: {
        color: colors.danger,
      },

      textInput: {
        backgroundColor: colors.white,
        color: colors.silver,
      },

      selectBoxStyles: {
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 6,
        height: 49,
        marginBottom: 10
      },

      selectInputStyles: {
        color: colors.black
      }
    }
  }

} as const;
