CRUDTASK - examen modulo 3

Este proyecto esta dividido en carpetas por pasos. Cada carpeta agrega una funcionalidad nueva y mantiene las anteriores.

Requisitos:
- Node.js para correr JSON Server

API falsa:
1) Iniciar la API en la raiz del proyecto (sin instalar global):
   npx -p json-server@0.17.4 json-server --watch db.json --port 3000
2) Para detenerla:
   Ctrl + C en la misma terminal

Usuarios de prueba:
- Admin: admin@crudtask.com / admin123
- User: juan@crudtask.com / juan123

Carpetas:
- 01-login: solo login
- 02-register: login + registro
- 03-tasks: login + registro + tareas
- 04-profile: login + registro + tareas + perfil
- 05-admin: login + registro + tareas + perfil + dashboard admin

Abrir en el navegador:
Puedes abrir los HTML directamente o con un servidor local.
