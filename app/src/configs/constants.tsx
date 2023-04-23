
import { SignedinUser, DoctorsDetail, FileUpload } from "../interfaces";


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
  phone_number: '',
  qualification: '',
  profession: '',
  title: '',
  experience: '',
  languages: '',
  image: '',
  service_fee: 0,
}

const initialFileUpload: FileUpload = {
  uri: null,
  source: null,
  name: null,
  type: null
}


export {
  initialUser,
  initialUserState,
  initialDoctorInfo,
  initialFileUpload
}