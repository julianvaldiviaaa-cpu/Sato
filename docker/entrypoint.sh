#!/bin/sh
set -e

echo "[sato-entrypoint] APP_ENV=${APP_ENV:-production} DB_CONNECTION=${DB_CONNECTION:-pgsql}"

# ------------------------------------------------------------------
# prepare_app: espera DB, migra, siembra assets y cachea config/route/view.
# Compartida por los modos "php-fpm" (docker-compose) y "render" (Render).
# ------------------------------------------------------------------
prepare_app() {
    echo "[sato-entrypoint] Preparando la aplicacion Laravel..."

    if [ -n "$DB_URL" ]; then
        echo "[sato-entrypoint] Esperando conexion a la base de datos (${DB_URL%%?*})..."
        i=0
        until php artisan migrate:status --no-interaction >/dev/null 2>&1; do
            i=$((i+1))
            if [ "$i" -ge 60 ]; then
                echo "[sato-entrypoint] ERROR: no se pudo conectar a la base de datos tras 60 intentos." >&2
                exit 1
            fi
            echo "[sato-entrypoint] DB no lista (intento $i), reintentando en 2s..."
            sleep 2
        done
        echo "[sato-entrypoint] Conexion a la base de datos OK."

        php artisan migrate --force --no-interaction
    else
        echo "[sato-entrypoint] AVISO: DB_URL no definido, omitiendo migraciones."
    fi

    [ -e public/storage ] || php artisan storage:link --no-interaction 2>/dev/null || true

    # Sembrar los assets compilados de Vite (en docker-compose van a un volumen compartido)
    if [ -d /build-assets ]; then
        mkdir -p public/build
        cp -a /build-assets/. public/build/
    fi

    php artisan config:cache --no-interaction || echo "[sato-entrypoint] AVISO: config:cache fallo (se seguira leyendo .env)."
    php artisan route:cache --no-interaction || echo "[sato-entrypoint] AVISO: route:cache fallo."
    php artisan view:cache --no-interaction || echo "[sato-entrypoint] AVISO: view:cache fallo."

    chown -R www-data:www-data storage bootstrap/cache || true
}

if [ "$1" = "php-fpm" ]; then
    prepare_app
elif [ "$1" = "reverb" ]; then
    # Servidor de Reverb standalone (docker-compose). Sin migraciones ni cacheos.
    mkdir -p bootstrap/cache
    shift
    if [ $# -eq 0 ]; then
        set -- php artisan reverb:start --no-interaction
    fi
elif [ "$1" = "render" ]; then
    # Modo Render: un solo contenedor sirve web (nginx) + php-fpm + Reverb,
    # todos por el mismo puerto publico ($PORT). nginx hace proxy /app -> Reverb.
    prepare_app

    echo "[sato-entrypoint] Arrancando Reverb en segundo plano (0.0.0.0:8080)..."
    php artisan reverb:start --no-interaction >/tmp/reverb.log 2>&1 &

    echo "[sato-entrypoint] Arrancando PHP-FPM en segundo plano..."
    php-fpm -F &

    echo "[sato-entrypoint] Generando configuracion de nginx con PORT=${PORT:-10000}..."
    mkdir -p /etc/nginx/http.d
    PORT="${PORT:-10000}" envsubst '$PORT' < /etc/nginx/conf.d/render.conf.template > /etc/nginx/http.d/render.conf

    echo "[sato-entrypoint] Arrancando nginx en foreground..."
    exec nginx -g "daemon off;"
fi

echo "[sato-entrypoint] Ejecutando: $*"
exec "$@"