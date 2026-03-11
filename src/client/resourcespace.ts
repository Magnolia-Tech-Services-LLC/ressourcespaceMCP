import axios, { AxiosInstance, AxiosError } from 'axios';
import crypto from 'crypto';
import { Config } from '../config.js';
import { ResourceSpaceError, ResourceSpaceRequestParams } from '../types/resourcespace.js';

export class ResourceSpaceClient {
  private axiosInstance: AxiosInstance;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.resourcespace.url,
      timeout: config.server.requestTimeout,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Generate SHA256 signature for ResourceSpace API authentication
   */
  private generateSignature(query: string): string {
    const signatureString = this.config.resourcespace.apiKey + query;
    return crypto.createHash('sha256').update(signatureString).digest('hex');
  }

  /**
   * Build query string from parameters (raw, unencoded)
   */
  private buildQueryString(params: ResourceSpaceRequestParams): string {
    const sortedParams: Record<string, string> = {};

    // Add user first
    sortedParams.user = this.config.resourcespace.user;

    // Add function
    sortedParams.function = params.function;

    // Add other parameters with param prefix
    let paramIndex = 1;
    Object.keys(params).forEach((key) => {
      if (key !== 'function') {
        const value = params[key];
        if (value !== undefined && value !== null) {
          sortedParams[`param${paramIndex}`] = String(value);
          paramIndex++;
        }
      }
    });

    return Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  /**
   * Execute API request with retry logic
   */
  private async executeRequest<T>(
    params: ResourceSpaceRequestParams,
    attempt: number = 1
  ): Promise<T> {
    const rawQueryString = this.buildQueryString(params);

    // Use new URL() to normalize the query string the same way axios does internally.
    // axios passes the URL through new URL() which encodes certain characters (e.g. " → %22).
    // The RS server receives this encoded form and uses it for signature verification,
    // so we must sign the encoded form to match.
    const tempUrl = new URL(`http://localhost/api/?${rawQueryString}`);
    const normalizedQueryString = tempUrl.search.slice(1); // remove leading '?'

    const signature = this.generateSignature(normalizedQueryString);
    const fullUrl = `/api/?${normalizedQueryString}&sign=${signature}`;

    try {
      const response = await this.axiosInstance.get(fullUrl);
      
      // Check for API-level errors in response
      if (response.data && typeof response.data === 'object') {
        if ('error' in response.data && response.data.error) {
          throw new ResourceSpaceError(
            response.data.error as string,
            'API_ERROR',
            200,
            response.data
          );
        }
      }

      return response.data as T;
    } catch (error) {
      if (error instanceof ResourceSpaceError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Retry on network errors or 5xx errors
        if (
          attempt < this.config.server.maxRetries &&
          (axiosError.code === 'ECONNABORTED' ||
            axiosError.code === 'ETIMEDOUT' ||
            (axiosError.response?.status && axiosError.response.status >= 500))
        ) {
          await this.delay(this.config.server.retryDelay * attempt);
          return this.executeRequest<T>(params, attempt + 1);
        }

        throw new ResourceSpaceError(
          axiosError.message,
          axiosError.code,
          axiosError.response?.status,
          axiosError.response?.data
        );
      }

      throw new ResourceSpaceError(
        'Unknown error occurred',
        'UNKNOWN_ERROR',
        undefined,
        error
      );
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Call any ResourceSpace API function
   */
  async call<T = unknown>(functionName: string, ...params: (string | number | boolean)[]): Promise<T> {
    const requestParams: ResourceSpaceRequestParams = {
      function: functionName,
    };

    params.forEach((param, index) => {
      requestParams[`param${index + 1}`] = param;
    });

    return this.executeRequest<T>(requestParams);
  }

  /**
   * Call API with named parameters (for complex requests)
   */
  async callWithParams<T = unknown>(
    functionName: string,
    params: Record<string, string | number | boolean>
  ): Promise<T> {
    const requestParams: ResourceSpaceRequestParams = {
      function: functionName,
      ...params,
    };

    return this.executeRequest<T>(requestParams);
  }

  /**
   * Upload file to ResourceSpace
   */
  async uploadFile(
    _filePath: string,
    resourceType: number,
    metadata: Record<string, string | number> = {}
  ): Promise<string> {
    // Note: File uploads in ResourceSpace API require special handling
    // This is a simplified version - full implementation may need multipart/form-data
    const params: ResourceSpaceRequestParams = {
      function: 'create_resource',
      resource_type: String(resourceType),
      ...metadata,
    };

    return this.executeRequest<string>(params);
  }

  /**
   * Download resource file
   */
  async downloadResource(resourceId: string | number, size: string = ''): Promise<Buffer> {
    const params: ResourceSpaceRequestParams = {
      function: 'get_resource_path',
      resource: String(resourceId),
    };

    if (size) {
      params.size = size;
    }

    const path = await this.executeRequest<string>(params);
    
    // Download the actual file
    const response = await this.axiosInstance.get(path, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  }

  /**
   * Test connection to ResourceSpace
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.call('get_system_info');
      return true;
    } catch {
      return false;
    }
  }
}

