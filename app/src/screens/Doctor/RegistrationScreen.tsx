import React, { useState} from 'react';
import { IUser } from '../../interfaces';
import RegistrationForm1 from './RegistrationForm1';
import CompleteRegistrationScreen from './CompleteRegistrationScreen';


const DoctorRegistrationScreen = ({ navigation }: { navigation: any }) => {
    const [screen, setScreen] = useState<number>(0);
    const [user, setUser] = useState<IUser>({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: '',
        phone_number: '',
    });

    const ScreenDisplay = () => {
        if (screen === 0) {
            return <RegistrationForm1 user={user} setUser={setUser} setScreen={setScreen} />
        } else if (screen === 1) {
            return <CompleteRegistrationScreen navigation={navigation} user={user} setUser={setUser} />
        }
    }

    return (<>{ScreenDisplay()}</>);
}

export default DoctorRegistrationScreen;