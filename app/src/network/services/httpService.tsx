import axios from 'axios';
import { API_URL } from '@env';
import { getAuthToken } from './asyncStorageService';


class Service {

  private baseUrl: string = '';

  constructor() {
    this.baseUrl = `${API_URL}/api/`
  }

  request = () => {
    const client = axios.create({
      baseURL: this.baseUrl
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

  post = async (endpoint: string, data: any, isMultipart = false) => {
    try {
      const headers = await this.getHeader(isMultipart);
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

  put = async (endpoint: string, data: any, isMultipart = false) => {
    try {

      const headers = await this.getHeader(isMultipart);
      const response = this.request().put(endpoint, data, headers).then(res => {
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

  delete = async (endpoint: string) => {
    try {

      const headers = await this.getHeader();
      const response = this.request().delete(endpoint, headers).then(res => {
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

      const bearerToken = await getAuthToken();
      const contentType = isMultipart ? 'multipart/form-data' : 'application/json'
      const headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': contentType,
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
