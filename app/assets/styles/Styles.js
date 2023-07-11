import {Dimensions, StyleSheet} from 'react-native';
import {colors} from "../../src/configs";
const {width, height} = Dimensions.get('window');
const cardWidth = width / 2.0;
const eventCardWidth = width - 40;
const eventCardHeight = height / 4;
const AppStyle = StyleSheet.create({
  categoryListContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },
  categoryListText1: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  card: {
    height: 400,
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
    // height: 100,
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
    height: 100,
    width: eventCardWidth/3,
    backgroundColor: colors.faded,
    // elevation: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  topHotelCardImage: {
    height: 100,
    width: 60,
    /* borderTopRightRadius: 10,
    borderTopLeftRadius: 10,*/
  },
  imageContainer: {
    height: eventCardHeight/1.7,
    width: eventCardWidth/3,
  },
  centerContent: {
    textAlign: 'center',
    /*justifyContent: "center",
    alignItems: "center"*/
  },
  eventsCard: {
    // height: height / 5,
    width: eventCardWidth / 2 - 10,
    backgroundColor: colors.primary,
    // elevation: 10,
   /* marginVertical: 10,
    marginHorizontal: 10,*/
    // borderRadius: 10,
  },
});

export {AppStyle};
