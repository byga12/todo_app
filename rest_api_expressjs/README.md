La idea es hacer una app web donde se puedan registrar varios usuarios, y cada uno tenga acceso a un CRUD de lista de tareas.
- Aplicar manejo de sesiones de usuario
- Formulario de registro/login, las contraseñas se guardan hasheadas (hasheo irreversible) en la DB

Stack/librerías utilizadas
- SQLite base de datos
-- libSQL database driver de SQLite
-- DrizzleORM con adaptador para SQLite
- Express.js librería para creación de servidor web
-- express-session librería para gestionar sesiones de usuario
--cors para manejo de solicitudes

Endpoints
GET /todos Para obtener una lista de todos los todos de un usuario
POST /sessions {username,password} Iniciar sesión
POST /todos {title,description} Para añadir un todo
PATCH /todos/:id {archived,done,title,description} Para modificar campos particulares de un todo (ya sea para archivar/desarchivar, togglear el estado (hecho/por hacer), modificar el título o la descripción)
DELETE /todos/:id para eliminar un todo definitivamente (de la base de datos)