import { createPapiMethod } from '@tramvai/papi';

// eslint-disable-next-line import/no-default-export
export default createPapiMethod({
  method: 'get',
  handler: async () => {
    return { ok: true };
  },
});
