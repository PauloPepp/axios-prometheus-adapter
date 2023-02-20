import { createAxiosPrometheusMiddleware } from './AxiosPrometheusAdapter';
import client, { Registry } from 'prom-client';
import { AxiosInstance } from 'axios';

describe('AxiosPrometheusAdapter', () => {
  let mockAxios: any;
  let mockRegistry: any;

  beforeEach(() => {
    mockAxios = {
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as any;
    mockRegistry = {
      registerMetric: jest.fn(),
    };
    client.Histogram = jest.fn();
  });

  test('creates new prom-client histogram and register it', () => {
    createAxiosPrometheusMiddleware(mockAxios as AxiosInstance, mockRegistry as Registry);

    expect(client.Histogram).toHaveBeenCalledTimes(1);
    expect(client.Histogram).toHaveBeenCalledWith({
      name: 'http_client_requests_seconds',
      help: 'Outgoing requests metrics',
      labelNames: ['status_code', 'method', 'protocol', 'host', 'path'],
    });
    expect(mockRegistry.registerMetric).toHaveBeenCalledTimes(1);
    expect(mockAxios?.interceptors?.request?.use).toHaveBeenCalledTimes(1);
    expect(mockAxios?.interceptors?.response?.use).toHaveBeenCalledTimes(1);
  });

  test('requestInterceptor callback function execution', () => {
    const mockStartTimer = jest.fn().mockReturnValue(1);
    client.Histogram = jest.fn().mockImplementation(() => ({
      startTimer: mockStartTimer,
    }));
    createAxiosPrometheusMiddleware(mockAxios as AxiosInstance, mockRegistry as Registry);

    const requestInterceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
    const mockConfig = {
      metadata: {
        endTimer: undefined,
      },
    };

    requestInterceptor(mockConfig);

    expect(mockStartTimer).toHaveBeenCalledTimes(1);
    expect(mockConfig.metadata.endTimer).toBeDefined();
  });

  test('responseInterceptor callback function execution', () => {
    const mockEndTimer = jest.fn();
    createAxiosPrometheusMiddleware(mockAxios as AxiosInstance, mockRegistry as Registry);

    const responseInterceptor = mockAxios.interceptors.response.use.mock.calls[0][0];
    const mockResponse = {
      config: {
        metadata: {
          endTimer: mockEndTimer,
        },
      },
      status: 200,
      request: {
        method: 'GET',
        protocol: 'https',
        host: 'localhost',
        path: '/1234?id=1234',
      },
    };
    const expectedLabels = {
      status_code: 200,
      method: 'GET',
      protocol: 'https',
      host: 'localhost',
      path: '/1234',
    };

    const response = responseInterceptor(mockResponse);

    expect(mockEndTimer).toHaveBeenCalledWith(expectedLabels);
    expect(response).toEqual(mockResponse);
  });
});
