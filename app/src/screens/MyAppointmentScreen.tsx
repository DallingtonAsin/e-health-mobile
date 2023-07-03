import React from 'react'
import { useWindowDimensions } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import { renderTabBar } from '../components/common/tabView'
import AppointmentsScreen from './Appointments/AppointmentsScreen'

const MyAppointmentScreen = ({ navigation }: { navigation: any }) => {

    const layout = useWindowDimensions()
    const [index, setIndex] = React.useState(0)

    const [routes] = React.useState([
        { key: 'pending', title: 'Pending' },
        { key: 'confirmed', title: 'Confirmed' },
        { key: 'completed', title: 'Completed' },
        { key: 'cancelled', title: 'Cancelled' }
    ])

    const onPressCard = (appointment_id: number) => {
        navigation.navigate('AppointmentDetails', { appointment_id: appointment_id })
    }

    const renderScene = SceneMap({
        pending: () => <AppointmentsScreen appointment_type={'pending'} onPress={onPressCard} />,
        confirmed: () => <AppointmentsScreen appointment_type={'confirmed'} onPress={onPressCard} />,
        cancelled: () => <AppointmentsScreen appointment_type={'cancelled'} onPress={onPressCard} />,
        completed: () => <AppointmentsScreen appointment_type={'completed'} onPress={onPressCard} />
    })

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }} />
    )
}

export default MyAppointmentScreen