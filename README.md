# Kanban Team App with AI Assistant

## Descripción
Esta es una aplicación Kanban para la gestión de tareas en equipo, con un asistente de IA para ayudar en la estimación de tareas.

## Requisitos
- Node.js 20
- Docker (opcional)

## Variables de Entorno
- `DATABASE_URL=file:./dev.db`
- `OPENAI_API_KEY` (opcional, para la integración de IA)
- `HOST=0.0.0.0`
- `PORT=3000`

## Ejecución en Bolt
1. Clona el repositorio.
2. Conéctate a Supabase en el cuadro de chat.
3. Ejecuta `npm install && npm run dev` para iniciar la aplicación.

## Ejecución en Docker
1. Construye la imagen: `docker build -t kanban-team-app .`
2. Ejecuta el contenedor: `docker run -p 3000:3000 kanban-team-app`

## Notas
- Asegúrate de tener configuradas las variables de entorno necesarias.
- La aplicación está diseñada para ser escalable y fácil de usar.
