import { createContext, useRef, useEffect } from "react";
import axios from 'axios';
import { API_URL } from '@env';

const AxiosContext = createContext(null);

const defaultConfig = {
    baseURL: API_URL
  }

const AxiosInstanceProvider = ({
  config = defaultConfig,
  requestInterceptors = [],
  responseInterceptors = [],
  children,
}) => {
  const instanceRef = useRef<any>(axios.create(config));

  useEffect(() => {
    requestInterceptors.forEach((interceptor) => {
      instanceRef.current.interceptors.request.use(
        interceptor
      );
    });
    responseInterceptors.forEach((interceptor) => {
      instanceRef.current.interceptors.response.use(
        interceptor
      );
    });
  }, []);

  return (
    <AxiosContext.Provider value={instanceRef.current}>
      {children}
    </AxiosContext.Provider>
  );
};

export {
    AxiosContext,
    AxiosInstanceProvider
}