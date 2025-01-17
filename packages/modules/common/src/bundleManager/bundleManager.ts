import eachObj from '@tinkoff/utils/object/each';
import { createBundle } from '@tramvai/core';
import { resolveLazyComponent, __lazyErrorHandler } from '@tramvai/react';
import type {
  BUNDLE_MANAGER_TOKEN,
  DISPATCHER_TOKEN,
  ActionsRegistry,
} from '@tramvai/tokens-common';
import type { Bundle } from '@tramvai/core';
import {
  fileSystemPagesEnabled,
  isFileSystemPageComponent,
  getAllFileSystemPages,
} from '@tramvai/experiments';
import type { ComponentRegistry } from '../componentRegistry/componentRegistry';

type Interface = typeof BUNDLE_MANAGER_TOKEN;

const FS_PAGES_DEFAULT_BUNDLE = '__default';

export class BundleManager implements Interface {
  bundles: Record<string, () => Promise<{ default: Bundle }>>;

  actionRegistry: ActionsRegistry;

  componentRegistry: ComponentRegistry;

  dispatcher: typeof DISPATCHER_TOKEN;

  constructor({ bundleList, componentRegistry, actionRegistry, dispatcher, logger }) {
    this.bundles = bundleList;
    this.componentRegistry = componentRegistry;
    this.actionRegistry = actionRegistry;
    this.dispatcher = dispatcher;

    if (fileSystemPagesEnabled()) {
      const log = logger('file-system-pages:bundle-manager');
      const components = getAllFileSystemPages();

      const componentsDefaultBundle = createBundle({
        name: FS_PAGES_DEFAULT_BUNDLE,
        components,
      });

      this.bundles[FS_PAGES_DEFAULT_BUNDLE] = () =>
        Promise.resolve({
          default: componentsDefaultBundle,
        });

      log.debug({
        event: 'create default bundle with file-system pages',
        components: Object.keys(components),
      });
    }
  }

  get(name: string, pageComponent: string) {
    // use fake bundle with file-system pages
    if (isFileSystemPageComponent(pageComponent)) {
      // eslint-disable-next-line no-param-reassign
      name = FS_PAGES_DEFAULT_BUNDLE;
    }
    return this.loadBundle(name, pageComponent).then((bundle: { default: Bundle }) =>
      this.resolve(bundle.default, pageComponent)
    );
  }

  has(name: string, pageComponent: string) {
    // use fake bundle with file-system pages
    if (isFileSystemPageComponent(pageComponent)) {
      // eslint-disable-next-line no-param-reassign
      name = FS_PAGES_DEFAULT_BUNDLE;
    }
    return !!this.bundles[name];
  }

  private async resolve(bundle: Bundle, pageComponent: string) {
    // preload `lazy` components then register actions and reducers
    if (pageComponent && bundle.components[pageComponent]) {
      const componentOrLoader = bundle.components[pageComponent];

      const component = await resolveLazyComponent(componentOrLoader);

      // allow page components to register any other components
      if ('components' in component) {
        eachObj((cmp, name: string) => {
          this.componentRegistry.add(name, cmp, pageComponent);
        }, component.components);
      }

      if ('actions' in component) {
        this.actionRegistry.add(pageComponent, component.actions);
      }

      if ('reducers' in component) {
        component.reducers.forEach((reducer) => {
          this.dispatcher.registerStore(reducer);
        });
      }
    }

    eachObj((component, name: string) => {
      this.componentRegistry.add(name, component, bundle.name);
    }, bundle.components);

    if (bundle.actions) {
      this.actionRegistry.add(bundle.name, bundle.actions);
    }

    if (bundle.reducers) {
      bundle.reducers.forEach((reducer) => {
        this.dispatcher.registerStore(reducer);
      });
    }

    return bundle;
  }

  private loadBundle(name: string, pageComponent: string) {
    if (!this.has(name, pageComponent)) {
      return Promise.reject(new Error(`Bundle "${name}" not found`));
    }

    return this.bundles[name]().catch((e) => __lazyErrorHandler(e, this.bundles[name]));
  }
}
