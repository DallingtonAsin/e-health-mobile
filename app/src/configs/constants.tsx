
import { SignedinUser, DoctorsDetail, FileUpload, Registration, PatientRegistrationPayload } from "../interfaces";


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
  qualification: '',
  training_institute: '',
  facility: '',
  lincense_number: '',
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



const registrationState: Registration = {
  patient: {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    gender: '',
    dob: '',
    password: '',
    password_confirmation: ''
  },
}


export {
  initialUser,
  initialUserState,
  initialDoctorInfo,
  initialFileUpload,
  registrationState
}