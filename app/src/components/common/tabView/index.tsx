import React from 'react'
import { Text } from 'react-native'
import * as config from '../../../configs'
import { TabBar } from 'react-native-tab-view'

const renderTabBar = (props: any) => (
    <TabBar
        {...props}
        renderLabel={({ route, focused }) => (
            <Text style={{ color: focused ? config.colors.primary : config.colors.black, fontSize: config.fonts.medium_15, fontWeight: '400' }}>
                {route.title}
            </Text>
        )}
        indicatorStyle={{ backgroundColor: config.colors.primary }}
        style={{ backgroundColor: config.colors.white }} />
)

export { renderTabBar}