import { isTokenExpired } from "@/utils/isTokenExpired";
import { AuthTokens } from "@/@types/auth";
import { useAppStore } from "@/store";
import { prepareUrl } from "@/@types/stables";
import { getCookie } from "cookies-next";
import { CookiesEnum } from "@/@types/enums/cookiesEnum";
import { enqueueSnackbar } from "notistack";

type InputTypes = string | Request | URL;
type HttpMethodType = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

type HeadersType = HeadersInit & { [key: string]: any };

interface FetchError extends Error {
  status?: number;
  code?: string;
}
interface FetchConfig extends Omit<RequestInit, "body" | "headers"> {
  requireAuth?: boolean;
  retryCount?: number;
  method?: HttpMethodType;
  body?: any;
  headers?: HeadersType;
  params?: any;
  stringify?: boolean;
}

/**
 * A client for making authenticated HTTP requests with CSRF protection and automatic retry functionality.
 *
 * @class
 * @description
 * FetchClient provides a wrapper around the Fetch API with the following features:
 * - CSRF token handling
 * - Authentication token management with automatic refresh
 * - Request retry logic
 * - Request cancellation via AbortController
 * - Type-safe responses
 *
 * @example
 *
 * const client = new FetchClient();
 * const response = await client.fetchClient<UserData>(
 *   '/api/users',
 *   { accessToken: 'xyz', refreshToken: 'abc' },
 *   { requireAuth: true }
 * );
 *
 *
 * @property {number} MAX_RETRIES - Maximum number of retry attempts for failed requests
 * @property {string} CSRF_HEADER - Header name for CSRF token
 * @property {AbortController | null} currentController - Controller for cancelling ongoing requests
 */
class FetchClient {
  private static instance: FetchClient | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly CSRF_HEADER = CookiesEnum.csrfToken;
  // Private constructor to prevent direct construction calls with the `new` operator
  private constructor() {}

  // Public static method to get instance
  public static getInstance(): FetchClient {
    if (!FetchClient.instance) {
      FetchClient.instance = new FetchClient();
    }
    return FetchClient.instance;
  }

  /**
   * Retrieves a CSRF token from the server by making a request to the /api/csrf endpoint.
   *
   * @returns A Promise that resolves to the CSRF token string. If no token is found in the response headers, returns an empty string.
   * @throws Will throw an error if the network request fails.
   */
  private async getCSRFToken(): Promise<string> {
    const controller = new AbortController();

    try {
      useAppStore.setState((state) => ({ ...state, isHttpClientLoading: true }));
      const response = await fetch("/api/csrf", { signal: controller.signal });
      return response.headers.get(this.CSRF_HEADER) || "";
    } catch (error: any) {
      throw new Error(`CSRF token fetch failed: ${error.message}`);
    } finally {
      useAppStore.setState((state) => ({ ...state, isHttpClientLoading: false }));
      controller.abort();
    }
  }

  /**
   * Refreshes the authentication token using a refresh token.
   *
   * @param refreshToken - The refresh token used to obtain a new access token
   * @returns Promise resolving to an AuthTokens object containing new access and refresh tokens
   * @throws Error if the token refresh request fails
   */
  private async refreshToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) throw new Error("No refresh token available");
    const csrfToken = await this.getCSRFToken();
    const controller = new AbortController();

    try {
      useAppStore.setState((state) => ({ ...state, isHttpClientLoading: true }));
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [this.CSRF_HEADER]: csrfToken,
        },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) {
        const error: FetchError = new Error("Token refresh failed");
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid token response format");
      }
      return data;
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.message}`);
    } finally {
      useAppStore.setState((state) => ({ ...state, isHttpClientLoading: true }));
      controller.abort();
    }
  }

  /**
   * Performs a fetch request with authentication, CSRF protection, and automatic retry functionality.
   *
   * @template T - The expected type of the response data
   * @param url - The URL to send the request to
   * @param config - Configuration options for the fetch request
   * @param config.requireAuth - Whether the request requires authentication
   * @param config.retryCount - Number of retry attempts made (internal use)
   * @param config.headers - Custom headers to include in the request
   * @param tokens - Authentication tokens object containing access and refresh tokens
   * @param tokens.accessToken - JWT access token for authentication
   * @param tokens.refreshToken - JWT refresh token for obtaining new access tokens
   *
   * @returns Promise resolving to the response data of type T
   *
   * @throws {Error} When authentication is required but no access token is available
   * @throws {Error} When token refresh is needed but no refresh token is available
   * @throws {Error} When authentication fails during token refresh
   * @throws {Error} When the HTTP response is not successful after all retry attempts
   */
  async fetchClient<T>(input: InputTypes, config: FetchConfig): Promise<T> {
    const { requireAuth = false, headers = {}, stringify = true, body, params, retryCount = 0, ...rest } = config;
    const { accessToken } = useAppStore.getState();
    const refreshToken = getCookie(CookiesEnum.userRefreshToken);
    const controller = new AbortController();

    useAppStore.setState((state) => ({ ...state, isHttpClientLoading: true }));

    if (requireAuth) {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      if (isTokenExpired(accessToken)) {
        if (refreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const newTokens = await this.refreshToken(refreshToken ?? "");
          useAppStore.setState((state) => ({ ...state, tokens: newTokens }));
        } catch (_error) {
          throw new Error("Authentication failed");
        }
      }
    }

    const csrfToken = await this.getCSRFToken();

    config = {
      ...rest,
      body,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        [this.CSRF_HEADER]: csrfToken,
        ...(requireAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: "include",
    };

    if (stringify) {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      };
      config.body = body !== undefined && stringify ? JSON.stringify(body) : body;
    }
    // Resolve URL using the utility function
    const url = prepareUrl(input instanceof globalThis.Request ? input.url : input.toString(), params);
    const req = new Request(url, config);

    try {
      const response = await fetch(req, config);
      if (!response.ok) {
        if (response.status === 401 && retryCount < this.MAX_RETRIES) {
          return this.fetchClient<T>(url, {
            ...config,
            retryCount: retryCount + 1,
          });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (retryCount < this.MAX_RETRIES) {
        return this.fetchClient<T>(url, {
          ...config,
          retryCount: retryCount + 1,
        });
      }
      if (error.message) enqueueSnackbar(error.message, { variant: "error" });
      throw error;
    } finally {
      useAppStore.setState((state) => ({ ...state, isHttpClientLoading: false }));
      controller.abort();
    }
  }
}

// Export singleton instance instead of class
export const fetchClient = FetchClient.getInstance();
