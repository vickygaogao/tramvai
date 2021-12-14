module.exports = {
  'Getting started': [
    'get-started/overview',
    'get-started/create-app',
    'get-started/app-structure',
    'get-started/core-modules',
  ],
  'Основные концепции': [
    'concepts/overview',
    'concepts/di',
    'concepts/provider',
    'concepts/module',
    'concepts/command-line-runner',
    'concepts/action',
    'concepts/bundle',
    'concepts/versioning',
  ],
  Возможности: [
    'features/react',
    {
      type: 'category',
      label: 'Routing',
      items: [
        'features/routing',
        {
          type: 'ref',
          label: 'Tramvai integration',
          id: 'references/modules/router',
        },
        {
          type: 'ref',
          label: 'Library @tinkoff/router',
          id: 'references/libs/router',
        },
      ],
    },
    {
      type: 'category',
      label: 'State management',
      items: [],
    },
    {
      type: 'category',
      label: 'Data fetching',
      items: [
        {
          type: 'ref',
          label: 'HTTP requests',
          id: 'references/modules/http-client',
        },
        {
          type: 'ref',
          label: 'Introduction to actions',
          id: 'concepts/action',
        },
        {
          type: 'ref',
          label: 'Create action',
          id: 'how-to/how-create-action',
        },
        {
          type: 'ref',
          label: 'Global actions',
          id: 'how-to/actions-execution',
        },
        {
          type: 'ref',
          label: 'Actions execution conditions',
          id: 'how-to/actions-conditions',
        },
        {
          type: 'ref',
          label: 'createAction interface',
          id: 'references/tramvai/create-action',
        },
      ],
    },
    {
      type: 'category',
      label: 'API routes',
      items: [
        'features/papi/introduction',
        {
          type: 'ref',
          label: 'Recipes',
          id: 'how-to/how-create-papi',
        },
        {
          type: 'ref',
          label: 'Library @tramvai/papi',
          id: 'references/libs/papi',
        },
      ],
    },
    {
      type: 'category',
      label: 'React Query',
      items: [],
    },
    'features/migration',
    'features/static-html-export',
    'features/file-system-pages',
    {
      type: 'category',
      label: 'Child App',
      items: [
        'features/child-app/child-app',
        'features/child-app/how-create-child-app',
        {
          type: 'ref',
          label: 'Module to connect Child App',
          id: 'references/modules/child-app',
        },
      ],
    },
  ],
  Guides: [
    'guides/tramvai-library',
    'guides/bundle-optimization',
    'guides/universal',
    'guides/deploy',
  ],
  Рецепты: [
    'how-to/how-create-module',
    'how-to/how-create-bundle',
    'how-to/how-create-action',
    'how-to/how-create-papi',
    'how-to/how-create-async-component',
    'how-to/how-enable-modern',
    'how-to/how-debug-modules',
    'how-to/tramvai-update',
  ],
  Справочник: [
    {
      type: 'category',
      label: 'API',
      items: [
        'references/tramvai/create-app',
        'references/tramvai/create-bundle',
        'references/tramvai/create-action',
        'references/tramvai/module',
      ],
    },
    {
      type: 'category',
      label: 'Модули',
      items: [],
    },
    {
      type: 'category',
      label: 'Библиотеки',
      items: [],
    },
    {
      type: 'category',
      label: 'Токены',
      items: [],
    },
  ],
  Релизы: [],
  Contribute: [],
};
