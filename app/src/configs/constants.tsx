
  import { SignedinUser } from "../interfaces";
  
  const initialLoginState: SignedinUser = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    dob: '',
    gender: '',
    address: '',
    otp: '',
    profile_status: false,
    authorization: '',
    token: '',

}

export  { initialLoginState }