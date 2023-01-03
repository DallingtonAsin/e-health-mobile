

const routes = {

   user: {
    signin: 'user/login',
    verify: 'user/verify',
    register: 'user/register',
    updateProfile: 'user/profile/update',
   },

   medical: {
      specialties: 'medical/specialties',
      doctors_by_specialty: 'medical/doctors/specialty',
   }

}

export { routes }