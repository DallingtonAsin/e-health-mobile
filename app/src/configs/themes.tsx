import {Platform} from "react-native";
import * as config from './';

export const themeColor = config.colors.primary; //  '#00AAAF';
export const lightThemeColor = '#f2f7f7';

export function getCalendarTheme() {
  const disabledColor = 'grey';

  return {

    // arrows
    arrowColor: 'black',
    arrowStyle: {padding: 0},

    // knob
    expandableKnobColor: themeColor,

    // month
    monthTextColor: 'black',
    textMonthFontSize: 18,
    textMonthFontFamily: 'HelveticaNeue',
    textMonthFontWeight: 'bold' as 'bold',

    // day names
    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 14,
    textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: 'normal' as 'normal',

    // dates
    dayTextColor: themeColor,
    todayTextColor: '#af0078',
    textDayFontSize: 18,
    textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: '500' as '500',
    textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},

    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: 'white',

    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)

    dotColor: themeColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: {marginTop: -2}
  };
}