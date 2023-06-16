
import { SignedinUser, DoctorsDetail, FileUpload, Registration, DrCompleteProfilePayload, IMedicalHistData } from "../interfaces";

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
  rating: 0,
  is_favourite: false,
  is_online: false
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
  umdp_license_id: '',
  license_number: '',
  service_fee: '',
  front_image: { uri: '', source: '', name: '', type: '' },
  back_image: { uri: '', source: '', name: '', type: '' },
}

const registrationState: Registration = {
  patient: _initialRegistrationData,
  doctor: _initialRegistrationData
}

const agoraConnectionInitialState = {
  appId: '',
  token: '',
  channel: ''
}

const InitialAppointmentDetailState = {
  id: 0,
  patient_id: 0,
  doctor_id: 0,
  appointment_number: '',
  appointment_type_id: 0,
  appointment_date: '',
  reason: '',
  notes: '',
  status: '',
  confirmed_at: '',
  reminded_at: '',
  completed_at: '',
  rescheduled_at: '',
  cancelled_at: '',
  is_doctor_notified: 0,
  alert_status: '',
  is_online: false,
  is_video: false,
  appointment_time: '',
  patient: {
    id: 0,
    first_name: '',
    last_name: '',
    country_code: '',
    phone_number: '',
    email: '',
    address: '',
    dob: '',
    age: '',
    image: '',
    thumbnail: ''
  },
  doctor: {
    id: 0,
    first_name: '',
    last_name: '',
    specialty_id: 0,
    primary_facility_id: 0,
    country_code: '',
    phone_number: '',
    email: '',
    qualification: '',
    address: '',
    image: '',
    service_fee: '',
    fcm_token: '',
    thumbnail: '',
    specialty: '',
    primary_facility: '',
    is_online: false
  },
  appointment_type: {
    id: 0,
    name: ''
  },
  meeting_access: {
    appId: '',
    channel: '',
    token: ''
  },
  medical_history: {
    id: 0,
    patient_id: 0,
    appointment_id: 0,
    past_medical_history: '',
    current_treatment: '',
    illness: '',
    diagnosis_date: '',
    treatment: ''
  }
}

const InitialMedicalHistData: IMedicalHistData = {
  presenting_complaint: '',
  past_medical_history: '',
  drug_allergies: '',
  findings: ''
}


export {
  initialUser,
  initialUserState,
  initialDoctorInfo,
  initialFileUpload,
  registrationState,
  InitialMedicalHistData,
  DrCompleteProfileInitialState,
  agoraConnectionInitialState,
  InitialAppointmentDetailState
}