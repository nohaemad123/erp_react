"use client";

import { CookiesEnum } from "@/@types/enums/cookiesEnum";
import { prepareUrl } from "@/@types/stables";
import { useAppStore } from "@/store";
import { getCookie } from "cookies-next";
import { enqueueSnackbar } from "notistack";

type HttpMethodType = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

type HeadersType = HeadersInit & { [key: string]: any };

interface IFetchClientConfig extends Omit<RequestInit, "body" | "headers"> {
  method?: HttpMethodType;
  body?: any;
  headers?: HeadersType;
  params?: any;
  stringify?: boolean;
}

/**
 * Makes an HTTP request with enhanced configuration and error handling.
 * Supports request cancellation, authentication, and automatic JSON handling.
 *
 * @template T - The expected response type
 * @param {string | URL | Request} input - The URL or Request object to fetch
 * @param {object} [config] - The fetch configuration options
 * @param {object} [config.params] - URL query parameters to be appended
 * @param {any} [config.body] - Request body
 * @param {boolean} [config.stringify=true] - Whether to stringify the body as JSON
 * @param {RequestInit} [config...init] - Additional fetch API options
 *
 * @returns {Promise<T>} A promise that resolves with the response data
 *
 * @throws {Error} When the request is cancelled
 * @throws {Error} When the request fails
 *
 * @example
 * const data = await fetchClient<UserData>('/api/users', {
 *   params: { id: 123 },
 *   body: { name: 'John' },
 *   method: 'POST'
 * });
 */
export default async function fetchClient<T>(
  input: string | URL | globalThis.Request,
  { params, body, stringify = true, ...init }: IFetchClientConfig = {},
): Promise<T> {
  useAppStore.setState((state) => ({ ...state, isHttpClientLoading: true }));
  const accessToken = useAppStore.getState().userToken || getCookie(CookiesEnum.userAccessToken);
  const auth = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  const config: IFetchClientConfig = {
    ...init,
    body,
    headers: {
      "Accept-Language": "ar",
      ...auth,
      ...init?.headers,
    },
  };

  if (stringify) {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    };
    config.body = body !== undefined && stringify ? JSON.stringify(body) : body;
  }

  // Resolve URL using the utility function
  const url = prepareUrl(input instanceof globalThis.Request ? input.url : input.toString(), params);

  const req = new Request(url, config);

  try {
    return await attemptFetch<T>(req, config);
  } catch (error: any) {
    // global error handler
    if (error.message) enqueueSnackbar(error.message, { variant: "error" });
    throw error;
  } finally {
    useAppStore.setState((state) => ({ ...state, isHttpClientLoading: false }));
  }
}

async function attemptFetch<T>(req: Request, config: IFetchClientConfig): Promise<T> {
  const res = await fetch(req, config);

  const jsonData = await res.json();

  if (!res.ok) {
    if (res.status >= 400) {
      // Handle other status codes 400 or higher
      throw { status: res.status, message: jsonData.message };
    }
  }

  return jsonData;
}
