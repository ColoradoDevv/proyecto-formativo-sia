# Proyecto Formativo SGI

Sistema de Gestión de Inventario (SGI) para la gestión de inventario, préstamos de materiales y usuarios dentro de una institución educativa (SENA).

## Stack tecnológico

**Backend** — Django 6 + Django REST Framework + Poetry  
**Frontend** — React 19 + Vite + Tailwind CSS + TanStack Table  
**Base de datos** — SQLite (desarrollo) / PostgreSQL (producción)

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Autenticación** | Login y control de sesión |
| **Usuarios** | CRUD de usuarios, roles y tipos de documento |
| **Material Consumible** | Registro y listado de materiales que se consumen |
| **Material Devolutivo** | Registro y listado de materiales que se devuelven |
| **Préstamos** | Registro y seguimiento de préstamos de materiales |
| **Retornos** | Registro de devoluciones de préstamos |
| **Marcas** | Gestión de marcas de productos |
| **Grupos y Permisos** | Control de acceso por roles |

## Estructura

```
proyecto-formativo-sia/
├── backend/
│   ├── sia_api/           # Configuración principal de Django
│   ├── modules/
│   │   ├── users/         # Usuarios, roles, tipos de documento
│   │   ├── products/      # Materiales consumibles y devolutivos
│   │   ├── loans/         # Préstamos
│   │   ├── returns/       # Retornos
│   │   └── tasks/         # Tareas
│   ├── manage.py
│   └── pyproject.toml
│
└── frontend/
    └── src/
        ├── app/           # Router y configuración principal
        ├── features/      # Módulos por funcionalidad
        ├── shared/        # Componentes, layouts y hooks reutilizables
        ├── services/      # Clientes de API
        └── assets/        # Imágenes y recursos estáticos
```

## Instalación

### Requisitos previos

- Python 3.11+
- Poetry
- Node.js 18+

### Backend

```bash
cd backend
poetry install
cp .env.example .env   # Configurar variables de entorno
python manage.py migrate
python manage.py runserver
```

La API quedará disponible en `http://localhost:8000`.  
La documentación de endpoints en `http://localhost:8000/docs/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Variables de entorno

Crea el archivo `backend/.env` con las siguientes variables:

```env
SECRET_KEY=tu_secret_key_de_django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos (PostgreSQL en producción)
DB_NAME=sia_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
```

## Scripts del frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Verificar código con ESLint |

---

> Proyecto formativo — [ColoradoDevv](https://github.com/ColoradoDevv)
