# Как установить SpeakMate на телефон

## Что уже готово

Приложение уже работает на компьютере:

- есть AI-преподаватель Alex;
- ответы идут через OpenAI API;
- можно писать фразы;
- можно говорить через микрофон в Chrome;
- приложение подготовлено как PWA для телефона.

## Почему нельзя просто скачать на телефон

OpenAI API key нельзя хранить внутри приложения на телефоне. Его могут украсть.

Поэтому нужна схема:

телефон -> HTTPS-сайт приложения -> сервер -> OpenAI

API key хранится только на сервере.

## Самый простой путь

Использовать Render:

https://render.com

## Что понадобится

1. GitHub аккаунт.
2. Render аккаунт.
3. OpenAI API key.
4. Папка `english-ai-coach`.

## Шаги

1. Создать новый репозиторий на GitHub, например:

```text
speakmate-ai-coach
```

2. Загрузить туда все файлы из папки `english-ai-coach`.

3. Открыть Render.

4. Нажать:

```text
New -> Web Service
```

5. Выбрать репозиторий `speakmate-ai-coach`.

6. В настройках Render указать:

```text
Build Command: npm install
Start Command: npm start
```

7. В Environment Variables добавить:

```text
OPENAI_API_KEY = твой OpenAI API key
HOST = 0.0.0.0
OPENAI_MODEL = gpt-4o-mini
```

8. Нажать Deploy.

9. Render даст ссылку вида:

```text
https://speakmate-ai-coach.onrender.com
```

10. Открыть эту ссылку на телефоне.

11. В Chrome на Android:

```text
Меню -> Добавить на главный экран
```

На iPhone в Safari:

```text
Поделиться -> На экран Домой
```

## Важно про расходы

Сейчас используется модель:

```text
gpt-4o-mini
```

Она недорогая и подходит для разговорного английского.

Чтобы случайно не потратить много, в OpenAI Platform поставь месячный лимит расходов.
