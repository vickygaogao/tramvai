import type { Page, Serializable } from 'puppeteer';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

type PageService = typeof PAGE_SERVICE_TOKEN;

type NavigateOptions = Parameters<PageService['navigate']>[0];
type UpdateCurrentRouteOptions = Parameters<PageService['updateCurrentRoute']>[0];

export const wrapRouter = (page: Page) => {
  const navigate = async (options: NavigateOptions) => {
    return page.evaluate((navigateOptions: NavigateOptions) => {
      return (window as any).contextExternal.di.get('router pageService').navigate(navigateOptions);
    }, options as unknown as Serializable);
  };

  const navigateThenWaitForReload = async (options: NavigateOptions) => {
    return Promise.all([
      page.evaluate((navigateOptions: NavigateOptions) => {
        (window as any).contextExternal.di.get('router pageService').navigate(navigateOptions);
      }, options as unknown as Serializable),

      page.waitForNavigation(),
    ]);
  };

  const updateCurrentRoute = async (options: UpdateCurrentRouteOptions) => {
    return page.evaluate((navigateOptions: UpdateCurrentRouteOptions) => {
      return (window as any).contextExternal.di
        .get('router pageService')
        .updateCurrentRoute(navigateOptions);
    }, options as unknown as Serializable);
  };

  return {
    navigate,
    navigateThenWaitForReload,
    updateCurrentRoute,
  };
};
