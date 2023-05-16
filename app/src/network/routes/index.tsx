

const routes = {

   patient: {
      index: 'patient',
      signin: 'patient/login',
      send_otp: 'patient/sms/verification-code',
      verify: 'patient/verify',
      register: 'patient/register',
      updateProfile: 'patient/profile/update',
      update_profile_pic: 'patient/profile-picture/update',
      delete_profile_pic: 'patient/profile-picture/delete',
      notifications: {
         all: 'patient/notifications',
         read: 'patient/notifications/read',
         unread: 'patient/notifications/unread',
         mark_as_read: 'patient/notifications/mark-as-read',
      },
      mark_doctor_favourite: 'patient/favourite-doctor',
      unmark_doctor_favourite: 'patient/favourite-doctor'
   },

   doctor: {
      signin: 'doctor/login',
      send_otp: 'doctor/sms/verification-code',
      verify: 'doctor/verify',
      register: 'doctor/register',
      is_verified: 'doctor/is-verified',
      complete_registration: 'doctor/profile/complete',
      updateProfile: 'doctor/profile/update',
      update_profile_pic: 'doctor/profile-picture/update',
      delete_profile_pic: 'doctor/profile-picture/delete',
      update_online_status: 'doctor/online-status',
      languages: 'doctor/languages',
      calendar: 'doctor/schedule',
      notifications: {
         all: 'doctor/notifications',
         read: 'doctor/notifications/read',
         unread: 'doctor/notifications/unread',
         mark_as_read: 'doctor/notifications/mark-as-read',
      }
   },

   medical: {
      specialties: 'medical/specialties',
      facilities: 'medical/facilities',
      doctors: 'medical/doctors',
      doctors_by_specialty: 'medical/doctors/specialty',
      history: 'medical-history/patient'
   },

   drugs: {
      index: 'drugs',
   },

   appointments: {
      index: 'appointments',
      cancel: 'appointments/cancel',
      types: 'appointments/types',
      meeting: 'appointments/meeting',
      patient: {
         myappointments: 'appointments/patient',
      },
      doctor: {
         myappointments: 'appointments/doctor',
      }
   }


}

export { routes }