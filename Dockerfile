# Этап сборки
FROM node:18-alpine as build

WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY public/ public/
COPY src/ src/

# Собираем проект
RUN npm run build

# Этап запуска
# FROM nginx:alpine

# Копируем собранное приложение из этапа сборки
# COPY --from=build /app/build /usr/share/nginx/html

# Копируем nginx конфигурацию
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 4040

# Запускаем nginx
# CMD ["nginx", "-g", "daemon off;"] 