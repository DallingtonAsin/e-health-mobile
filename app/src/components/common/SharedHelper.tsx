import Toast from 'react-native-simple-toast';
import { MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION, PRE_RELEASE } from '@env';
import { FacilityJson, setPasswordError } from '../../interfaces';
import moment from 'moment';

const removeLeadingZeros = (number: string) => {
  if (number) {
    while (number.charAt(0) === '0') {
      number = number.substring(1);
    }
    return number;
  }
}

const getGreeting = () => {

  let greeting = '';
  const date = new Date();
  const hour = date.getHours();

  switch (true) {
    case hour < 12:
      greeting = 'Good Morning'
      break;
    case hour >= 12 && hour < 17:
      greeting = 'Good afternoon'
      break;
    case hour >= 17:
      greeting = 'Good evening'
      break;
  }

  return greeting;
}

const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  let formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

const displayMessage = (message: string | any) => {
  if (message && typeof message === 'string') {
    Toast.show(message, Toast.LONG);
  }
}

const toastShortMessage = (message: string | any) => {
  if (message && typeof message === 'string') {
    Toast.show(message, Toast.SHORT);
  }
}

const displayErrorMessage = (error: any, onFailure: any) => {
  let message;
  if (error && error.response) {
    message = error.response.data.message;
  } else if (error.message) {
    message = String(error.message);
  } else if (error.error) {
    message = String(error.error);
  } else {
    message = String(error);
  }

  onFailure(message);
}


const getUserInitials = (name: string) => {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("");
  }
  return name;
}

const getCurrentDate = () => {
  const date = new Date();
  const formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
  return formattedDate;
}

const readableDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: any = { weekday: 'short', day: 'numeric', month: 'long' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

const readableTime = (timeStr: any) => {
  const date = new Date(`1970-01-01T${timeStr}:00`);
  const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = date.toLocaleTimeString('en-US', options);
  return formattedTime
}

const strContains = (str: string, substr: string) => {
  return str.toLocaleLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1
}

const getDayMonth = (date: string) => {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
  return [day, monthName];
}

const isValidEmail = (email: any): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getJsonObjByValue = (arr: any, value: any) => {
  let result = arr.filter(function (obj: any) {
    return obj.value === value;
  });
  return result[0];
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const isValidDob = (birthdateStr: string) => {
  const birthdate = new Date(birthdateStr);
  const today: any = new Date();

  const ageDiffMs = today - birthdate.getTime();
  const ageDate = new Date(ageDiffMs);

  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age >= 18
}

const getAppVersion = () => {
  let version = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`;
  if (PRE_RELEASE) {
    version = version.concat(`-${PRE_RELEASE}`);
  }
  return version;
};

const formatNumber = (num: any) => {
  const regex = /(\d)(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regex, '$1,');
};

const removeCommas = (num: any) => {
  return num.toString().replace(/,/g, '');
};

const validatePassword = (password: string, setPasswordError: setPasswordError) => {
  if (password.length < 8) {
    setPasswordError('Password must be at least 8 characters long');
  } else {
    setPasswordError('');
  }
};

const validateConfirmPassword = (password: string, confirmPassword: string, setPasswordError: setPasswordError) => {
  if (confirmPassword !== password) {
    setPasswordError('Passwords do not match');
  } else {
    setPasswordError('');
  }
};

const truncateString = (str: string, numWords: number) => {
  const words = str.split(' ');
  if (words.length <= numWords) {
    return str;
  } else {
    const truncatedWords = words.slice(0, numWords);
    return truncatedWords.join(' ') + '...';
  }
}

const getPairByKey = (arr: FacilityJson[], key: any) => {
  if (arr.length > 0) {
    const pair = arr.find(obj => obj.key === key);
    return pair
  }
}

const getPairByValue = (arr: FacilityJson[], value: any) => {
  if (arr.length > 0) {
    const pair = arr.find(obj => obj.value === value);
    console.log(`pair 1`, pair)
    return pair
  }
}
function getPairsByKeys(arr: FacilityJson[], keys: any) {
  if (arr.length > 0) {
    const pairs: any = [];
    arr.forEach((obj: FacilityJson) => {
      if (keys.includes(obj.key)) {
        const key = parseInt(obj.key.toString())
        const json = { key: key, value: obj.value }
        pairs.push(json);
      }
    });
    return pairs;
  }
}

function convertFrom24HrTime(time: string) {
  const convertedTime = moment(time, 'HH:mm').format('h:mm A');
  return convertedTime
}

export {
  removeLeadingZeros,
  getGreeting,
  displayMessage,
  formatDate,
  displayErrorMessage,
  getUserInitials,
  getCurrentDate,
  readableDate,
  readableTime,
  strContains,
  getDayMonth,
  isValidEmail,
  isValidDob,
  getPairByKey,
  getPairByValue,
  getPairsByKeys,
  getJsonObjByValue,
  getAppVersion,
  numberWithCommas,
  formatNumber,
  removeCommas,
  truncateString,
  validatePassword,
  toastShortMessage,
  convertFrom24HrTime,
  validateConfirmPassword
}