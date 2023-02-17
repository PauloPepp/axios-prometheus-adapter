import { AxiosInstance } from 'axios';
import client from 'prom-client';

export type AxiosPrometheusAdapterConfig = {
  name: string,
  help: string,
  labelNames: string[]
};

export const createAxiosPrometheusMiddleware = (
  axiosInstance: AxiosInstance, 
  registry: client.Registry, 
  config?: AxiosPrometheusAdapterConfig
): void => {
  const clientRequestDuration = new client.Histogram({
    name: 'http_client_requests_seconds_count',
    help: 'http_client_requests_seconds_count',
    labelNames: ['status_code', 'method', 'protocol', 'host', 'path'],
    ...config,
  });

  // todo: chack user

  registry.registerMetric(clientRequestDuration);

  axiosInstance.interceptors.request.use((config: any) => {
    const end = clientRequestDuration.startTimer();

    config.metadata = {
      endTimer: end,
    };
    return config;
  });

  axiosInstance.interceptors.response.use((response: any) => {
    const labels = {
      status_code: response.status,
      method: response.request.method,
      protocol: response.request.protocol,
      host: response.request.host,
      path: response.request.path,
    };
    response.config.metadata.endTimer(labels);
    return response;
  }, error => {
    const labels = {
      status_code: error.response.status,
      method: error.response.request.method,
      protocol: error.response.request.protocol,
      host: error.response.request.host,
      path: error.response.request.path,
    };
    error.config.metadata.endTimer(labels);
    return Promise.reject(error);
  });
};