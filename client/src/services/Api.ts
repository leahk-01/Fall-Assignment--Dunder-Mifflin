/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreatePaperDto {
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  stock: number;
  /**
   * @format double
   * @min 0.01
   */
  price: number;
  propertyIds: number[];
}

export interface Customer {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name?: string | null;
  /**
   * @minLength 0
   * @maxLength 255
   */
  address?: string | null;
  /**
   * @minLength 0
   * @maxLength 50
   */
  phone?: string | null;
  /**
   * @minLength 0
   * @maxLength 255
   */
  email?: string | null;
  orders?: Order[] | null;
}

export interface CustomerDto {
  /** @minLength 1 */
  name: string;
  address?: string | null;
  /**
   * @minLength 1
   * @pattern ^\d+$
   */
  phone: string;
  /**
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface Order {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  /**
   * @minLength 0
   * @maxLength 50
   */
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  customer?: Customer;
  orderEntries?: OrderEntry[] | null;
}

export interface OrderDto {
  /** @format int32 */
  customerId?: number;
  orderEntries?: OrderEntryDto[] | null;
  status?: string | null;
}

export interface OrderEntry {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  paperId?: number | null;
  /** @format int32 */
  orderId?: number | null;
  order?: Order;
  paper?: Paper;
}

export interface OrderEntryDto {
  /** @format int32 */
  paperId?: number;
  /** @format int32 */
  quantity?: number;
}

export interface OrderStatusDto {
  status?: string | null;
}

export interface Paper {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name?: string | null;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
  orderEntries?: OrderEntry[] | null;
}

export interface PaperDto {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format double */
  price?: number;
  /** @format int32 */
  stock?: number;
  properties?: PropertyDto[] | null;
}

export interface PropertyDto {
  /** @format int32 */
  id?: number;
  propertyName?: string | null;
  propertyValue?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  length: number;
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Api
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Customers
     * @name CustomersCreateCreate
     * @request POST:/api/Customers/create
     */
    customersCreateCreate: (data: CustomerDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Customers/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomersDetail
     * @request GET:/api/Customers/{id}
     */
    customersDetail: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Customers/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersPlaceOrderCreate
     * @request POST:/api/Orders/place-order/{customerId}
     */
    ordersPlaceOrderCreate: (customerId: number, data: OrderDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Orders/place-order/${customerId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersCustomerHistoryDetail
     * @request GET:/api/Orders/customer-history/{customerId}
     */
    ordersCustomerHistoryDetail: (customerId: number, params: RequestParams = {}) =>
      this.request<OrderDto[], any>({
        path: `/api/Orders/customer-history/${customerId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersInfoDetail
     * @request GET:/api/Orders/info/{orderId}
     */
    ordersInfoDetail: (orderId: number, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/api/Orders/info/${orderId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersList
     * @request GET:/api/Orders
     */
    ordersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Orders`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersStatusUpdate
     * @request PUT:/api/Orders/status/{orderId}
     */
    ordersStatusUpdate: (orderId: number, data: OrderStatusDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Orders/status/${orderId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperCreate
     * @request POST:/api/Paper
     */
    paperCreate: (data: CreatePaperDto, params: RequestParams = {}) =>
      this.request<PaperDto, any>({
        path: `/api/Paper`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperAllList
     * @request GET:/api/Paper/all
     */
    paperAllList: (params: RequestParams = {}) =>
      this.request<Paper[], any>({
        path: `/api/Paper/all`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperApiPaperDetail
     * @request GET:/api/Paper/api/paper/{id}
     */
    paperApiPaperDetail: (id: number, params: RequestParams = {}) =>
      this.request<PaperDto, any>({
        path: `/api/Paper/api/paper/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDiscontinueUpdate
     * @request PUT:/api/Paper/discontinue/{id}
     */
    paperDiscontinueUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/discontinue/${id}`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperRestockUpdate
     * @request PUT:/api/Paper/restock/{id}
     */
    paperRestockUpdate: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/restock/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperPropertiesList
     * @request GET:/api/Paper/properties
     */
    paperPropertiesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/properties`,
        method: "GET",
        ...params,
      }),
  };
}
