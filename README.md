# Proyecto Formativo SIA

Sistema de información desarrollado como proyecto formativo, con arquitectura separada en backend y frontend.

## Tecnologías

**Backend** — Django + Poetry  
**Frontend** — React + Vite

## Estructura

```
proyecto-formativo-sia/
├── backend/    # API Django
└── frontend/   # Aplicación React
```

## Instalación

### Backend

```bash
cd backend
poetry install
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

Crea un archivo `.env` en la carpeta `backend/` basándote en `.env.example` (si existe) con las variables necesarias para la base de datos y configuración de Django.

---

> Proyecto formativo — [ColoradoDevv](https://github.com/ColoradoDevv)
