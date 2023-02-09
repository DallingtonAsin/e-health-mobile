

const routes = {

   user: {
    signin: 'user/login',
    verify: 'user/verify',
    register: 'user/register',
    updateProfile: 'user/profile/update',
   },

   medical: {
      specialties: 'medical/specialties',
      doctors: 'medical/doctors',
      doctors_by_specialty: 'medical/doctors/specialty',
   },

   appointments: {
      types: 'appointments/types',
      index: 'appointments',
   }


}

export { routes }