import axios from 'axios';
import { API_URL } from '@env';
import { getAccessToken } from './asyncStorageService';

// const defaultHeaders = {
//   "Accept": "application/json",
//   "Content-Type": "application/json"
// }

class Service {

  request = () => {
    const client = axios.create({
      baseURL: API_URL
    });

    return client;
  }

  get = async (endpoint: string) => {
    try {
      const headers = await this.getHeader();
      const response = this.request().get(endpoint, headers).then(res => {
        return res;
      }).catch((error) => { throw error });
      return response;
    } catch (err) {
      throw err;
    }
  }

  post = async (endpoint: string, data: any) => {
    try {
      const headers = await this.getHeader();
      const response = this.request().post(endpoint, data, headers).then(res => {
        return res;
      }).catch((error) => {
        if (error && error.response && error.response.data) throw error.response.data
        throw error
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  getHeader = async (isMultipart = false) => {
    try {

      const bearerToken = await getAccessToken();
      const headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        },
      }
      return headers;

    } catch (err) {
      throw err;
    }
  }



}

export default Service;