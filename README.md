# ВопроСФУ бэкенд

---
У многих студентов возникает огромное
количество вопросов при учебном процессе,
ответы на которые не может дать даже интернет.
Поэтому мы решили создать не просто сайт,
а цифровое сообщество, где студенты и преподаватели
могли бы делиться своим опытом, помогая друг другу.

Диаграмма БД - https://dbdiagram.io/d/vopros-sfu-6703e024fb079c7ebd9a8ac1

## Запуск

---
0. Создать папку .env, скопировать в неё содержимое .env.example, настроить docker-compose, установив свои параметры, соответствующие .env (или использовать готовые)
1. `npm install`
2. `npm run migration:run`
3. dev: `npm run start:dev`, prod: `pm2 start ecosystem.config.js`

Swagger - `APP_HOST`:`APP_PORT`/api/v1/docs

