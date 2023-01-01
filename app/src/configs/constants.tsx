
  import { SignedinUser } from "../interfaces";

  const initialUser = {
    first_name: '',
    last_name: '',
    email: '',
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

export  { initialUserState }