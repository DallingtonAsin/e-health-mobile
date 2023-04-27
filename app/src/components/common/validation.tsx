import { PatientRegistrationPayload } from '../../interfaces';
import { isValidEmail } from './SharedHelper';


const validatePatientRegistration = (user: PatientRegistrationPayload, hasAgreedTerms: boolean) => {
    if (!user.first_name) {
        return 'Enter your first name'
    }

    if (!user.last_name) {
        return 'Enter your last name'
    }

    if (user.email) {
        if (!isValidEmail(user.email)) {
            return 'Please enter a valid email'
        }
    }

    if (!user.address) {
        return 'Enter your address'
    }

    if (!user.gender) {
        return 'Select your gender'
    }

    if (!user.dob) {
        return 'Enter your date of birth'
    }

    if (!user.password) {
        return 'Enter password'
    }

    if (!user.password_confirmation) {
        return 'Please confirm your password'
    }

    if (user.password !== user.password_confirmation) {
        return 'Your passwords donot match'
    }

    if (!hasAgreedTerms) {
        return 'Please agree to the terms and conditions to proceed.'
    }

    return undefined;
}

export { validatePatientRegistration }