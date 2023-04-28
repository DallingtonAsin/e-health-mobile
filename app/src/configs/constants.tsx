
import { SignedinUser, DoctorsDetail, FileUpload, Registration, PatientRegistrationPayload, DrCompleteProfilePayload } from "../interfaces";


const initialUser = {
  first_name: '',
  last_name: '',
  email: '',
  country_code: '',
  phone_number: '',
  dob: '',
  gender: '',
  address: '',
  otp: '',
  profile_status: false,
}

const initialUserState: SignedinUser = {
  user: initialUser,
  authorization: '',
  token: '',
}

const initialDoctorInfo: DoctorsDetail = {
  id: 0,
  first_name: '',
  last_name: '',
  country_code: '',
  phone_number: '',
  gender: '',
  qualification: '',
  primary_facility: '',
  training_institute: '',
  facility: '',
  license_number: '',
  bio_summary: '',
  image: '',
  service_fee: 0,
  schedule_dates: [],
  schedule: [],
}

const initialFileUpload: FileUpload = {
  uri: null,
  source: null,
  name: null,
  type: null
}

const _initialRegistrationData = {
  first_name: '',
  last_name: '',
  email: '',
  address: '',
  gender: '',
  dob: '',
  password: '',
  password_confirmation: ''
}

const DrCompleteProfileInitialState: DrCompleteProfilePayload = {
  specialty: '',
  primary_facility: '',
  other_facilities: [],
  address: '',
  bio_summary: '',
  qualification: '',
  training_institute: '',
  license_number: '',
  service_fee: '',
  front_image: {uri: '', source: '', name: '', type: ''},
  back_image: {uri: '', source: '', name: '', type: ''},
}



const registrationState: Registration = {
  patient: _initialRegistrationData,
  doctor: _initialRegistrationData
}

export {
  initialUser,
  initialUserState,
  initialDoctorInfo,
  initialFileUpload,
  registrationState,
  DrCompleteProfileInitialState
}