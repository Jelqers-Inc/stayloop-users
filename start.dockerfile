FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json al directorio de trabajo.
# Se copian por separado para aprovechar el caché de capas de Docker.
COPY package*.json ./

# Instala las dependencias del proyecto.
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo.
COPY . .

# Expone el puerto en el que se ejecuta la aplicación (si es necesario).
# Cambia el 3000 por el puerto que realmente use tu aplicación.
EXPOSE 3000

# El comando para ejecutar la aplicación cuando se inicie el contenedor.
CMD [ "node", "app.js" ]
