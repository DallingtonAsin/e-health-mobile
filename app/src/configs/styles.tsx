import { Dimensions } from 'react-native';
import { colors, } from './colors';
import { fonts } from './fonts'
import * as configs from "./index";

const {width, height} = Dimensions.get('window');
const cardWidth = width / 1.8;
const eventCardWidth = width - 40;
const eventCardHeight = height / 4;
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
    alignSelf: 'center'
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

  continueText: {
    color: colors.white,
    fontSize: fonts.extraLarge,
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

  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20
  },

  btnText: {
    color: colors.primary,
    fontSize: fonts.large,
  },

  primaryBtnText: {
    color: colors.white,
    fontSize: fonts.large,
  },

  secondaryBtnText: {
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

  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.silver,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 80,
    height: 80,
    tintColor: colors.silver,
    borderWidth: 1,
  },

  noInfoText: {
    fontSize: fonts.large,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    textAlign: 'center',
    color: configs.colors.gray
  },

  completedTxt: {
    backgroundColor: colors.confirmedBg,
    color: colors.confirmedColor

  },

  pendingTxt: {
    backgroundColor: colors.pendingBg,
    color: colors.pendingColor
  },

  confirmedTxt: {
    backgroundColor: colors.warning,
    color: colors.white
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

  supCount: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: colors.orange,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  callBtn: {
    color: colors.white,
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2
  },

  sms: {
    paddingLeft: 10,
  },

  contacts: {
    flexDirection: 'row',
    // alignItems: 'stretch'
  },

  documentId: {
    width: 150,
    height: 150
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
        flex: 1
      },

      scrollContainer: {
        flexGrow: 1,
        padding: 10,
      },

      inputWrap: {
        flex: 1,
        paddingHorizontal: 5,
      },

      labelTxt: {
        fontSize: 16,
        color: colors.black,
      },

      viewContainer: {
        flex: 1,
        marginVertical: 5,
      },

      title: {
        marginVertical: 10,
        textAlign: 'center',
        fontSize: fonts.extraLarge,
        // fontWeight: '800',
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
        color: colors.red
      },

      textInput: {
        backgroundColor: colors.white,
        color: colors.silver,
      },

      selectBoxStyles: {
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 4,
        // height: 50,
        // marginTop: 6,
        // marginBottom: 10
      },

      selectInputStyles: {
        color: colors.black
      }
    }
  },

  online: {
    color: colors.success,
    fontSize: fonts.small,
    // fontWeight: 'bold',
    textTransform: 'capitalize'
  },

  offline: {
    color: colors.light_gray,
    fontSize: fonts.small,
    // fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  card: {
    height: 280,
    width: cardWidth,
    elevation: 15,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  priceTag: {
    height: 60,
    width: 80,
    backgroundColor: colors.primary,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    padding: 20,
    width: '100%',
  },
  cardOverLay: {
    height: 280,
    backgroundColor: colors.white,
    position: 'absolute',
    zIndex: 100,
    width: cardWidth,
    borderRadius: 15,
  },
  topHotelCard: {
    height: eventCardHeight/1.7,
    width: eventCardWidth/3,
    backgroundColor: colors.primary,
    // elevation: 15,
    marginHorizontal: 10,
    // borderRadius: 10,
  },
  topHotelCardImage: {
    height: 80,
    width: '100%',
    /* borderTopRightRadius: 10,
    borderTopLeftRadius: 10,*/
  },
  imageContainer: {
    height: eventCardHeight/1.7,
    width: eventCardWidth/3,
  },

} as const;
