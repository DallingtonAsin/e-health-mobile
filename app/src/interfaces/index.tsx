interface IUser {
    first_name: string,
    last_name: string,
    email?: string,
    dob: string,
    gender: string,
    address: string
}

interface LoginData {
    country_code: string,
    phone_number: string,
    current_version: string,
}



export type { IUser, LoginData }