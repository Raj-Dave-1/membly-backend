# Dada Ki Jay Ho

FROM node:15
WORKDIR /app
COPY package.json .
ARG NODE_ENV
# RUN if [ "${NODE_ENV}" = "production" ]; \
#     then npm install --only=production; \
#     else npm install; \
#     fi
RUN npm install
COPY . .
RUN npm run build



