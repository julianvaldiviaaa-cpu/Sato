# Despliegue Docker de produccion — Laravel Sato

Contenedores listos para producción con un solo comando:

```bash
docker compose up -d --build
```

Accede en **http://localhost:8000** (o el puerto de `APP_PORT`).

---

## Arquitectura

Tres servicios, sin base de datos empaquetada (usa **Neon**/PostgreSQL externo via `DB_URL`):

| Servicio | Imagen                                        | Rol                                           | Puerto |
|----------|-----------------------------------------------|-----------------------------------------------|--------|
| `app`    | `sato-app` (Dockerfile multi-stage)           | PHP-FPM 8.5 + Laravel + migraciones           | 9000 (interno) |
| `nginx`  | imagen + `docker/nginx/default.conf`          | Web server público, sirve la app              | `APP_PORT` (8000) |
| `reverb` | `sato-app` en modo websocket                  | Tiempo real (Inertia/Echo), sobre 8080        | `REVERB_PUBLIC_PORT` (8080) |

```
[ Navegador ] --HTTP--> nginx --fastcgi--> app (PHP-FPM)
     |                             |
     +---WS :8080 (Reverb) <-----> app (envia a reverb por la red interna)
```

- Los tres servicios comparten la red interna `sato-net`.
- `nginx` espera (healthcheck) a que `app` termine sus migraciones antes de arrancar.
- Volumen `storage_data` para uploads de `storage/app` (compartido entre `app` y `nginx`).

---

## Requisitos

- Docker Engine con **Docker Compose v2** (Docker Desktop en Windows/Mac, `lando` no).
  - Verifica: `docker compose version`
- Dispone del puerto `8000` y `8080` libres, o define `APP_PORT` / `REVERB_PUBLIC_PORT` en `.env`.

## Variables necesarias en `.env` (ya están en tu copia local)

| Variable | Ejemplo | Nota |
|----------|---------|------|
| `APP_KEY` | `base64:...` | **Imprescindible.** No debe coincidir con el entorno dev. Genéralà con `php artisan key:generate`. |
| `APP_URL` | `http://localhost:8000` | Coincide con el puerto publicado de `nginx`. |
| `DB_CONNECTION` | `pgsql` | |
| `DB_URL` | `postgresql://...@...neon.tech/neondb?sslmode=require&channel_binding=require` | Tu Neon (ya está). |
| `REVERB_APP_KEY/SECRET/ID` | `sato-local-key` / ... | Credenciales del websocket. |
| `VITE_REVERB_*` | `localhost:8080` | Se inyectar en el **build** (ver abajo). |

> El docker-compose lee `.env` automáticamente (`env_file`). `REVERB_APP_KEY` es obligatorio (`:?`).

---

## Build del frontend y Wayfinder (advertencia importante)

El plugin de Vite **`@laravel/vite-plugin-wayfinder` ejecuta `php artisan wayfinder:generate`** durante
`npm run build`. Por eso la etapa `assets` del Dockerfile incluye PHP + el vendor de Composer; no basta
con Node puro.

Los valores `VITE_REVERB_HOST`/`PORT`/`SCHEME` se **queman dentro del JS en tiempo de build**
(`docker build --build-arg ...`). Si cambias el host del websocket, **reconstruye** la imagen:

```bash
docker compose build --build-arg VITE_REVERB_HOST=ws.midominio.com reverb app
docker compose up -d
```

En producción, si Reverb está bajo HTTPS/WSS, define `VITE_REVERB_SCHEME=https` y para servir `REVERB_SCHEME=https` en `reverb` (TLS direccionado). 

---

## Comandos utiles

```bash
# Levantar
docker compose up -d --build

# Ver logs de un servicio
docker compose logs -f app
docker compose logs -f reverb

# Migrar / limpiar cache dentro del contenedor
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:clear

# Regenerar APP_KEY (solo si realmente lo necesitas)
docker compose exec app php artisan key:generate

# Detener
docker compose down
```

---

## Notas técnicas (decisiones de diseño)

- **Base de datos externa (Neon)**: no se corre Postgres en el contenedor; se usa `DB_URL`. La retención de
  sesión/cache/utileria es `database` (sin Redis), así que no se necesita Redis.
- **Sin queue worker**: los eventos usan `ShouldBroadcastNow` → no hace falta `queue:work`.
- **`config:cache`**: el entrypoint ejecuta `config:cache`, `route:cache` y `view:cache`. Como el contenedor
  no copia `.env` (viene de las env vars de Compose), al ser PHP-FPM con `clear_env=no` el cacheo obtiene
  los valores correctos. En `app` esto incluye `REVERB_HOST=reverb` (red interna).
- **`reverb`**: arranca con `php artisan reverb:start` sin re-migrar ni re-cachear (lo hace `app`).
- **Uploads**: el volumen `storage_data` persiste `storage/public` y se monta tanto en `app` (PHP escribe)
  como en `nginx` (sirve). El symlink `public/storage → storage/app/public` se crea en build y se verifica en el entrypoint.
- **Imagen** es multi-stage: `php-base` (ext: `pdo_pgsql, pgsql, bcmath, mbstring, pcntl, curl, sodium, opcache`) → `vendor` (Composer, `--no-dev`) → `assets` (Node 22 + Vite) → `runner` (Alpine + php-fpm + frontend compilado).
- **No se monta el código** desde el host (se copia en imagen) → artefactos reproducibles. Solo `storage_data` está montado.

---

## Problemas frecuentes

| Síngoma | Solución |
|---------|----------|
| `SQLSTATE[42710] constraint "1" already exists` | Bug de Laravel 13.x + Neon al usar `->constrained()->index()`. Ya corregido en las migraciones: separar índices y nombres explícitos `order_items_order_id_foreign`. |
| `docker: not found` | El daemon Docker no ha terminado/arrancó. Tras instalar Docker Desktop **reinicia** el equipo y abre Docker Desktop. |
| El build falla en la etapa `vendor` | Configura una clave en las env vars o `-e` (ver `REVERB_APP_KEY`) — no es el caso. |
| La app no conexa a Neon | Confirma que `DB_URL` en `.env` no expiró (Neon rota las contraseñas) y que `APP_ENV=production` con `APP_DEBUG=false`. |

---

## Correr un worker de schedule (opcional)

Si más adelante necesitas tareas agendadas (no hay actualmente):

```yaml
  scheduler:
    image: sato-app:latest
    restart: unless-stopped
    command: sh -c "php artisan schedule:work"
    env_file: .env
    environment:
      BROADCAST_CONNECTION: reverb
    networks: [sato-net]
    depends_on:
      app: { condition: service_started }
```

(Fragmento a añadir bajo el servicio `reverb` en `docker-compose.yml`.)