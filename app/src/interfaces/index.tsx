interface IUser {
    first_name: string,
    last_name: string,
    email?: string,
    dob: string,
    gender: string,
    address: string
}

interface SignedinUser {
    first_name: string,
    last_name: string,
    email?: string,
    dob: string,
    gender: string,
    address: string,
    otp: string,
    profile_status: boolean,
    authorization:string,
    token: string,
}


interface LoginData {
    country_code: string,
    phone_number: string,
    current_version: string,
}



export type { IUser, LoginData, SignedinUser }