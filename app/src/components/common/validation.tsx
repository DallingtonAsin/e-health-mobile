import { DoctorRegistrationPayload, PatientRegistrationPayload } from '../../interfaces';
import { isValidDob, isValidEmail } from './SharedHelper';

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

const validateDoctorRegistration = (user: DoctorRegistrationPayload, hasAgreedTerms: boolean) => {
    if (!user.first_name) {
        return 'Enter your first name'
    }

    if (!user.last_name) {
        return 'Enter your last name'
    }

    if (!user.email) {
        return 'Enter your email address'
    }

    if (!isValidEmail(user.email)) {
        return 'Please enter a valid email'
    }

    if (!user.gender) {
        return 'Select your gender'
    }

    if (!user.dob) {
        return 'Enter your date of birth' 
    }

    if (!isValidDob(user.dob)) {
        return 'Enter valid date of birth. Doctor must be atleast greater than 18'
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
        return 'Please agree to our terms and conditions before signup'
    }

    return undefined;
}


export { validatePatientRegistration, validateDoctorRegistration }