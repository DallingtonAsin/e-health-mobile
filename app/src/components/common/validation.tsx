import { DoctorRegistrationPayload, DrCompleteProfilePayload, FileUpload, IUser, PatientRegistrationPayload } from '../../interfaces';
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


const ValidateDrCompleteProfile = (doctor: DrCompleteProfilePayload, selectedFacilities: string[], hasAgreedTerms: boolean, frontImage: FileUpload, backImage: FileUpload) => {
    if (!doctor.specialty) {
        return 'Select your specialty'
    }

    if (!doctor.primary_facility) {
        return 'Select your primary facility or workplace'
    }

    if (selectedFacilities && selectedFacilities.length > 0) {
        if (selectedFacilities.indexOf(doctor.primary_facility) !== -1) {
            return 'Please remove your primary facility from the selected other facilities.'
        }
    }

    if (!doctor.address) {
        return 'Enter your address'
    }

    if (!doctor.bio_summary) {
        return 'Enter your brief biography'
    }

    if (!doctor.qualification) {
        return 'Enter your qualification'
    }

    if (!doctor.training_institute) {
        return 'Enter your latest training institute'
    }

    if (!doctor.umdp_license_id) {
        return 'Enter your UMDP license number'
    }

    if (!doctor.service_fee) {
        return 'Enter your consultation fee'
    }

    if (!frontImage.uri) {
        return 'Please upload your front image of ID'
    }

    if (!backImage.uri) {
        return 'Please upload your back image of ID'
    }

    if (!hasAgreedTerms) {
        return 'Please agree to our medical worker agreement to continue.'
    }

    return undefined;
}

const validateProfileUpdate = (user: IUser, selectedFacilities: number[],) => {
    if (!user.first_name) {
        return 'Enter your first name'
    }

    if (!user.last_name) {
        return 'Enter your last name'
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

    if (!user.is_patient) {

        if (!isValidDob(user.dob)) {
            return 'Enter valid date of birth. Doctor must be atleast greater than 18'
        }

        if (!user.email) {
            return 'Enter your email'
        }

        if (!user.qualification) {
            return 'Enter your qualification'
        }

        if (selectedFacilities && selectedFacilities.length > 0) {
            console.log(`selected facilities`, selectedFacilities)
            const primary_facility: number | undefined = user.primary_facility_id
            if (primary_facility !== undefined) {
                if (selectedFacilities.indexOf(primary_facility) !== -1) {
                    return 'Please remove your primary facility from the selected other facilities.'
                }
            }
        }

        if (!user.training_institute) {
            return 'Enter your training institute'
        }

        if (!user.umdp_license_id) {
            return 'Enter your license number'
        }

        if (!user.bio_summary) {
            return 'Enter your brief biography'
        }

        if (!user.service_fee) {
            return 'Enter your consultation fee per 15 minutes'
        }
    }

    return undefined
}

export { validatePatientRegistration, validateDoctorRegistration, ValidateDrCompleteProfile, validateProfileUpdate }