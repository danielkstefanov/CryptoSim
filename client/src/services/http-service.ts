import {
  InvalidLoginCredentials,
  ValidationException,
} from "../lib/errors/base-errors";

import { authService } from "./auth-service";
import { UserStorage } from "./user-storage";

import { throwHttpError } from "../lib/errors/http-errors";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

const baseUrl = import.meta.env.VITE_BASE_URL;

interface RequestOptions {
  query?: object;
  body?: object;
}

class HttpService {
  async get<ResultType = unknown>(route: string, query?: object) {
    return await this.request<ResultType>(route, HttpMethod.GET, { query });
  }

  async post<ResultType = unknown>(route: string, body: object) {
    return await this.request<ResultType>(route, HttpMethod.POST, { body });
  }

  async put<ResultType = unknown>(route: string, body: object) {
    return await this.request<ResultType>(route, HttpMethod.PUT, { body });
  }

  async patch<ResultType = unknown>(route: string, body: object) {
    return await this.request<ResultType>(route, HttpMethod.PATCH, { body });
  }

  async delete(route: string) {
    return await this.request(route, HttpMethod.DELETE, {});
  }

  private async request<ResultType = unknown>(
    route: string,
    method: HttpMethod,
    options: RequestOptions
  ) {
    const headers = new Headers();

    if (options.body) {
      headers.append("Content-Type", "application/json");
    }

    const userStorage = new UserStorage();
    const token = userStorage.token;

    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    const sanitizedRoute = route.replace(/^\/+/, "");

    const queryParams = new URLSearchParams();

    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        queryParams.append(key, `${value}`);
      });
    }

    const queryString = queryParams.toString();

    const response = await fetch(
      `${baseUrl}/${sanitizedRoute}?${queryString}`,
      {
        method,
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      }
    );

    if (!response.ok) {
      const responseBody = await response.json();

      if (
        response.status === 401 &&
        responseBody?.name === "TokenExpiredError"
      ) {
        authService.logout();
      }

      if (
        "name" in responseBody &&
        responseBody.name === "BadCredentialsException"
      ) {
        throw new InvalidLoginCredentials(responseBody.message);
      }

      if (
        "name" in responseBody &&
        responseBody.name === "ValidationException"
      ) {
        throw new ValidationException(responseBody.message);
      }

      if (response.status === 400) {
        throw new ValidationException(Object.values(responseBody).join(", "));
      }

      throwHttpError(response.status);
    }

    return (await response.json()) as ResultType;
  }
}

const httpService = new HttpService();
export default httpService;
