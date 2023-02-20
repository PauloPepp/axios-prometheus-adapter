import type { AxiosInstance } from 'axios';
import type { Registry } from 'prom-client';
import client from 'prom-client';

export type AxiosPrometheusAdapterConfig = {
  name: string,
  help: string,
  labelNames: string[]
};

export const createAxiosPrometheusMiddleware = (
  axiosInstance: AxiosInstance, 
  registry: Registry, 
  config?: AxiosPrometheusAdapterConfig
): void => {
  const clientRequestDuration = new client.Histogram({
    name: 'http_client_requests_seconds',
    help: 'Outgoing requests metrics',
    labelNames: ['status_code', 'method', 'protocol', 'host', 'path'],
    ...config,
  });

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
      path: response.request.path.split('?')[0],
    };
    response.config.metadata.endTimer(labels);
    return response;
  }, error => {
    const labels = {
      status_code: error.response.status,
      method: error.response.request.method,
      protocol: error.response.request.protocol,
      host: error.response.request.host,
      path: error.response.request.path.split('?')[0],
    };
    error.config.metadata.endTimer(labels);
    return Promise.reject(error);
  });
};
