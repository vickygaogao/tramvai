import { Module, Scope, provide } from '@tramvai/core';
import { WEB_FASTIFY_APP_LIMITER_TOKEN } from '@tramvai/tokens-server-private';
import { fastifyRequestsLimiter, RequestLimiter } from './requestLimiter';
import {
  REQUESTS_LIMITER_TOKEN,
  REQUESTS_LIMITER_OPTIONS_TOKEN,
  REQUESTS_LIMITER_ACTIVATE_TOKEN,
} from './tokens';

export * from './requestLimiter';
export * from './tokens';

@Module({
  providers: [
    provide({
      provide: REQUESTS_LIMITER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ options, featureEnable }) => {
        if (featureEnable === false) {
          return;
        }
        return new RequestLimiter(options ?? {});
      },
      deps: {
        options: { token: REQUESTS_LIMITER_OPTIONS_TOKEN, optional: true },
        featureEnable: { token: REQUESTS_LIMITER_ACTIVATE_TOKEN, optional: true },
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_LIMITER_TOKEN,
      multi: true,
      useFactory: ({ requestsLimiter, featureEnable }) => {
        return async (app) => {
          if (featureEnable === false) {
            return;
          }

          await fastifyRequestsLimiter(app, { requestsLimiter });
        };
      },
      deps: {
        requestsLimiter: REQUESTS_LIMITER_TOKEN,
        featureEnable: { token: REQUESTS_LIMITER_ACTIVATE_TOKEN, optional: true },
      },
    }),
  ],
})
export class RequestLimiterModule {}
