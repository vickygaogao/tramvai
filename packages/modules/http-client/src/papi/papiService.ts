import find from '@tinkoff/utils/array/find';
import flatten from '@tinkoff/utils/array/flatten';
import type { HttpClientRequest, HttpClientResponse } from '@tramvai/http-client';
import { createChildContainer } from '@tinkoff/dippy';
import { getPapiParameters } from '@tramvai/papi';
import { REQUEST, RESPONSE } from '@tramvai/module-common';
import type { Deps } from './papiService.h';

export class PapiService {
  papi: Deps['papi'];
  di: Deps['di'];

  constructor({ papi, di }: Deps) {
    this.papi = flatten(papi || []);
    this.di = di;
  }

  async request<R = any>({ path, query, body }: HttpClientRequest): Promise<HttpClientResponse<R>> {
    const papiRoute = find((papi) => getPapiParameters(papi).path === `/${path}`, this.papi);

    if (!papiRoute) {
      throw new Error(`papi handler '${path}' not found`);
    }

    const papi = getPapiParameters(papiRoute);
    let rootDeps = {};

    if ((papi as any).rootDeps) {
      rootDeps = this.di.getOfDeps((papi as any).rootDeps);

      rootDeps = (papi as any).mapRootDeps ? (papi as any).mapRootDeps(rootDeps) : rootDeps;
    }

    const childDI = createChildContainer(this.di);
    const req = { headers: { host: 'localhost' }, cookies: {}, query, body };
    const res = {};

    childDI.register({
      provide: REQUEST,
      useValue: req,
    });
    childDI.register({
      provide: RESPONSE,
      useValue: res,
    });

    const payload = await getPapiParameters(papiRoute).handler({
      ...rootDeps,
      ...childDI.getOfDeps(papi.deps ?? {}),
      req,
      res,
    });

    return { payload, status: 200, headers: {} };
  }

  get<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request({
      path,
      ...payload,
      ...config,
      method: 'GET',
    } as HttpClientRequest);
  }

  post<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'POST',
    } as HttpClientRequest);
  }

  put<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'PUT',
    } as HttpClientRequest);
  }

  delete<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      ...payload,
      ...config,
      method: 'DELETE',
    } as HttpClientRequest);
  }
}