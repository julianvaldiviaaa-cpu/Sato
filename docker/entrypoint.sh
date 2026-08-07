#!/bin/sh
set -e

echo "[sato-entrypoint] APP_ENV=${APP_ENV:-production} DB_CONNECTION=${DB_CONNECTION:-pgsql}"

if [ "$1" = "php-fpm" ]; then
    echo "[sato-entrypoint] Preparando la aplicacion Laravel..."

    # --- Esperar a la base de datos (Neon) antes de migrar ---
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

        # --- Migraciones y symlink de storage ---
        php artisan migrate --force --no-interaction
    else
        echo "[sato-entrypoint] AVISO: DB_URL no definido, omitiendo migraciones."
    fi

    [ -e public/storage ] || php artisan storage:link --no-interaction 2>/dev/null || true

    # --- Sembrar los assets compilados de Vite en el volumen compartido con nginx ---
    if [ -d /build-assets ]; then
        mkdir -p public/build
        cp -a /build-assets/. public/build/
    fi

    # --- Cacheos de produccion (config:cache deja de leer .env; se usa el env del contenedor) ---
    php artisan config:cache --no-interaction || echo "[sato-entrypoint] AVISO: config:cache fallo (se seguira leyendo .env)."
    php artisan route:cache --no-interaction || echo "[sato-entrypoint] AVISO: route:cache fallo."
    php artisan view:cache --no-interaction || echo "[sato-entrypoint] AVISO: view:cache fallo."

    chown -R www-data:www-data storage bootstrap/cache || true
elif [ "$1" = "reverb" ]; then
    # El servidor de Reverb se inicia directamente, sin migraciones ni cacheos
    # (los comparte el servicio "app"). Solo se asegura el dir de cache.
    mkdir -p bootstrap/cache
    shift
    if [ $# -eq 0 ]; then
        set -- php artisan reverb:start --no-interaction
    fi
fi

echo "[sato-entrypoint] Ejecutando: $*"
exec "$@"
