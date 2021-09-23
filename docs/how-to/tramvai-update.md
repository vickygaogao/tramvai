---
id: tramvai-update
title: Обновление tramvai в приложении
sidebar_label: Обновление tramvai
---

Большинство библиотек в `tramvai` репозитории объединены в общее версионирование - это `core` пакеты, трамвай модули и токены.
Это значительно упрощает обновление `tramvai` на конкретную версию.

Подробная документация доступна в разделе [Версионирование](concepts/versioning.md)

Для обновления пакетов разработана cli команда `tramvai update`.
Эта команда обновляет версии всех `@tramvai/*` и `@tramvai-tinkoff/*` зависимости в приложении, и старается сделать дедупликацию в `lock` файле, подстраиваясь под используемый пакетный менеджер.

## Обновление до latest версии

`tramvai update` по умолчанию использует `latest`:

```bash
tramvai update
```

## Обновление до конкретной версии

Флаг `--to` позволяет указать точную версию:

```bash
tramvai update --to 1.0.0
```

## Проверка версий tramvai в приложении

Для автоматической проверки синхронизации версий трамвай зависимостей создана утилита `@tramvai/tools-check-versions`,
для запуска нужно выполнить команду:

```bash
yarn tramvai-check-versions
```