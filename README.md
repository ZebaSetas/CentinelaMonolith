# Proposito y alcance del proyecto

El proposito es el de implementar un sistema de seguimiento de errores que pueda ser contratado como un servicio SaaS.
El sistema que sera llamado **Centinela** proveerá las siguientes funcionalidades:

- Registro de errores y bugs desde los sistemas de la empresa (con identificación de prioridad y ambiente que lo reporta)
- Administración de usuarios (administradores y desarrolladores)
- Administración de bugs (edición, asignación a usuarios, resolución, etc)
- Notificaciones por correo y distintos reportes sobre los errores generados.

## Introducciones para configurar un ambiente de desarrollo

Para ejecutar el sistema, se deberan hacer los siguientes pasos:

##### Backend

1. Por un lado se debe ingresar en la carpeta backend y ejecutar el comando **npm install** para instalar las dependencias del proyecto de backend y luego **npm install nodemon -g** para instalar nodemon de manera global.
2. Una vez ejecutado el comando anterior, se deberán  configurar las variables de entorno, para ello se debe de crear dentro de esta carpeta (backend) un archivo de nombre **.env**. El contenido de este archivo se debe de copiar del archivo **.env-example** donde se encuentran los nombres de todas las variables de entorno del proyecto y algunas con ejemplos de que deben llevar.
3. Una vez configuradas las variables de entorno se procederá a levantar el sistema, para ello primero ejecutaremos **nodemon** en la carpeta backend para iniciar la aplicación Centinela
4. Luego proseguiremos a iniciar worker que enviara los correos con el comando **node src/sender.js**
5. A continuacion levantaremos el workr encargado de procesar los bugs con **node src/bugProcessor.js**
6. Finalmente iniciamos el monitor con **node src/monitoring.js**
7. No olvidar que para que estos funcionen localmente debemos de tener corriendo redis

##### Frontend

1. Por un lado se debe ingresar en la carpeta frontend/centinela-cli y ejecutar el comando **npm install** para instalar las dependencias del proyecto de backend.
2. Una vez ejecutado el comando anterior, para iniciar el frontend se debe de ejecutar el comando **ng build** para compilar el frontend y luego **ng serve** para iniciar el front o utilizar la variante **ng serve -o** la cual lo inicia y luego abre el navegador por defecto.
