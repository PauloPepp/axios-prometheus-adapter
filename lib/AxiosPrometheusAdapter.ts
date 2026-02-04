import type { AxiosInstance } from 'axios';
import type { Registry } from 'prom-client';
import client from 'prom-client';

// Path normalizer to prevent unbounded cardinality in metrics
// Replaces dynamic segments (numbers, UUIDs, etc.) with placeholders
const normalizePath = (path: string): string => {
  return path
    // Replace UUIDs (8-4-4-4-12 format)
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:uuid')
    // Replace any numeric IDs in paths
    .replace(/\/[0-9]+(?=\/|$)/g, '/:id');
};

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

  // eslint-disable-next-line complexity
  axiosInstance.interceptors.response.use((response: any) => {
    const labels = {
      status_code: response.status.toString(),
      method: response.request.method || response.config.method?.toUpperCase() || 'UNKNOWN',
      protocol: response.request.protocol || 'https:',
      host: response.request.host || new URL(response.config.url || '').hostname,
      path: normalizePath(response.request.path?.split('?')[0]),
    };
    response.config.metadata.endTimer(labels);
    return response;
  }, error => {
    let labels;
    if (error.response) {
      labels = {
        status_code: error.response.status.toString(),
        method: error.response.request.method,
        protocol: error.response.request.protocol,
        host: error.response.request.host,
        path: normalizePath(error.response.request.path.split('?')[0]),
      };
    } else if (error.request._currentRequest) {
      labels = {
        status_code: error.status.toString(),
        method: error.request._currentRequest.method,
        protocol: error.request._currentRequest.protocol,
        host: error.request._currentRequest.host,
        path: normalizePath(error.request._currentRequest.path.split('?')[0]),
      };
    } else {
      labels = {
        status_code: 500,
        method: 'UNKNOWN',
        protocol: 'UNKNOWN',
        host: 'UNKNOWN',
        path: 'UNKNOWN',
      };
    }
    error.config.metadata.endTimer(labels);
    return Promise.reject(error);
  });
};
