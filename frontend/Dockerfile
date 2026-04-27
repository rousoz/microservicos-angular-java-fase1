# Use Node.js to build the Angular app
FROM node:18-alpine AS build
WORKDIR /app

# 1. Copia apenas os arquivos de pacotes
COPY package*.json ./

# 2. Instala as dependências (fica em cache se o package.json não mudar)
RUN npm ci

# 3. SÓ AGORA copia o resto do código
COPY . .

# 4. Build
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine

# Copy built app to nginx
#COPY --from=build /app/dist/frontend /usr/share/nginx/html
# Se o seu projeto se chama 'frontend', o Angular 19 gera em:
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html


# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]