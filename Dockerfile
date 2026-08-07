# syntax=docker/dockerfile:1.4
# =====================================================================
#  Laravel Sato - Dockerfile de produccion (multi-stage) (en la raiz
#  para que Render/Docker lo encuentren por defecto como ./Dockerfile).
#  Los COPY-* son relativos al CONTEXTO (raiz del repo = docker/...).
# =====================================================================

# ---------------------------------------------------------------------
# Stage base: PHP-FPM + extensiones compartidas por build y runtime
# ---------------------------------------------------------------------
FROM php:8.5-fpm-alpine AS php-base

RUN apk add --no-cache \
        libpq \
        libcurl \
        libxml2 \
        oniguruma \
        unzip \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpq-dev \
        curl-dev \
        libxml2-dev \
        oniguruma-dev \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        curl \
        mbstring \
        pcntl \
        pdo_pgsql \
        pgsql \
    && docker-php-ext-enable sodium \
    && apk del .build-deps

# ---------------------------------------------------------------------
# Stage: dependencias PHP de produccion (Composer)
# ---------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# ---------------------------------------------------------------------
# Stage: assets frontend (Vite). Requiere PHP >= 8.4 (plugin Wayfinder).
# ---------------------------------------------------------------------
FROM php:8.5-cli-alpine AS assets

# Node/npm del repositorio de Alpine + PHP 8.5 ya incluido en la imagen
RUN apk add --no-cache nodejs npm

WORKDIR /var/www/html

# Codigo de la app (sin node_modules/vendor segun .dockerignore) + vendor de produccion
COPY . .
COPY --from=vendor /var/www/html/vendor ./vendor

# Dirs base para que el artisan del plugin wayfinder arranque sin warnings
RUN mkdir -p bootstrap/cache storage/framework/views storage/logs

RUN npm ci --no-audit --no-fund

# Variables inyectadas por Vite en el bundle (build-time).
# VACIAS por defecto -> bootstrap.ts cae a window.location (mismo host/esquema).
# docker-compose las sobreescribe con localhost:8080 al buildear.
ARG VITE_APP_NAME="Sato"
ARG VITE_REVERB_HOST=""
ARG VITE_REVERB_PORT=""
ARG VITE_REVERB_SCHEME=""
ARG VITE_REVERB_APP_KEY="sato-local-key"
ENV VITE_APP_NAME="${VITE_APP_NAME}" \
    VITE_REVERB_HOST="${VITE_REVERB_HOST}" \
    VITE_REVERB_PORT="${VITE_REVERB_PORT}" \
    VITE_REVERB_SCHEME="${VITE_REVERB_SCHEME}" \
    VITE_REVERB_APP_KEY="${VITE_REVERB_APP_KEY}"

RUN npm run build

# ---------------------------------------------------------------------
# Stage final: imagen de runtime
# ---------------------------------------------------------------------
FROM php-base AS runner

WORKDIR /var/www/html

# nginx + envsubst para el modo "render" (un solo contenedor en Render)
RUN apk add --no-cache nginx gettext

# Configuracion PHP / PHP-FPM
COPY docker/php/zz-sato.ini    /usr/local/etc/php/conf.d/zz-sato.ini
COPY docker/php/zz-www.conf    /usr/local/etc/php-fpm.d/zz-www.conf
# Plantilla de nginx para Render (se genera en el entrypoint con $PORT)
COPY docker/nginx/render.conf.template /etc/nginx/conf.d/render.conf.template

# Codigo de la app (respetando .dockerignore)
COPY . .

# Dependencias PHP + frontend compilado.
# public/build se comparte con nginx via volumen (se sembra en el entrypoint),
# por eso se guarda en una ruta separada: /build-assets
COPY --from=vendor  /var/www/html/vendor ./vendor
COPY --from=assets  /var/www/html/public/build /build-assets

# Preparar storage y symlink public/storage
RUN set -eux; \
    mkdir -p storage/framework/cache/data \
             storage/framework/sessions \
             storage/framework/views \
             storage/logs \
             bootstrap/cache; \
    chown -R www-data:www-data storage bootstrap/cache; \
    chmod -R ug+rw storage bootstrap/cache; \
    ln -sfn /var/www/html/storage/app/public /var/www/html/public/storage

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]