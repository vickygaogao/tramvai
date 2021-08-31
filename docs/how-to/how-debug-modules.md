---
id: how-debug-modules
title: Как дебажить модули?
---

Для удобной отладки модулей необходимо включить отображение логов для уникальных идентификаторов логгера, которые были созданы в отлаживаемых модулях. Документация библиотеки [@tinkoff/logger](references/libs/logger.md) содержит подробные примеры работы с логгером.

Рекомендуется указывать список идентификаторов логгеров в README к каждому модулю, в противном случае для поиска нужных идентификаторов можно посмотреть вхождения по строке `logger(`.

Уровени и идентификаторы отображаемых логов указываются отдельно для сервера и для клиента, по умолчанию отображаются все логи с уровнем `error` и выше.

### Отображение логов на сервере

Настройки серверных логов задаются в переменных окружения `LOG_LEVEL` и `LOG_ENABLE`, при необходимости можно поменять эти настройки в рантайме, через papi метод `/{appName}/private/papi/logger` с дополнительными query параметрами. Подробнее про доступные параметры можно прочитать в документации [@tramvai/module-log](references/modules/log.md)

```bash
LOG_ENABLE='router' // отображает все логи для логгера с идентификатором `router`
```

### Отображение логов на клиенте

Настройки клиентских логов регулируются через методы библиотеки logger. Эти настройки сохраняются в localStorage, поэтому для отображения всех клиентских логов с новыми настройками, надо дополнительно перезагрузить страницу, либо очистить localStorage.

```tsx
import logger from '@tinkoff/logger';

logger.enable('router'); // отображает все логи для логгера с идентификатором `router`
```