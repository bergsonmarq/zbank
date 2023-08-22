# Imagem base para o Node.js
FROM node:14

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código-fonte
COPY . .


