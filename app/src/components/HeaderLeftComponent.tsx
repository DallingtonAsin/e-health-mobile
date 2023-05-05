
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import * as configs from '../configs'

const HeaderLeftComponent = ({ headerShown = false, headerTitle, tabBarLabel, tabIcon, onPressBackButton, }:
  { headerShown?: boolean, tabBarLabel: string, headerTitle: string, tabIcon: string, onPressBackButton: any }): any => ({
    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
      <Icon5
        name={tabIcon}
        style={{
          fontSize: 20,
          color: color,
        }}
      />
    ),
    headerShown: headerShown,
    headerStyle: {
      borderBottomWidth: 0.5,
      borderBottomColor: configs.colors.silver,
      height: 60,
      elevation: 2,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 3 }
    },
    headerLeft: () => (
      <Icon5
        name="arrow-left"
        size={20}
        onPress={onPressBackButton}
        style={{ marginLeft: 15, color: configs.colors.primary }}
      />
    ),
    title: headerTitle,
    headerTitleAlign: 'left',
    headerTitleStyle: { color: configs.colors.primary, marginLeft: 20, fontWeight: 'normal' },
    tabBarLabel: tabBarLabel,
    tabBarLabelStyle: {
      fontSize: configs.fonts.normal
    }
  })

export { HeaderLeftComponent }