    
FROM node:12.16.1

RUN npm install -g pm2

ENV TZ=Asia/Ho_Chi_Minh
ENV DATABASE_URL=postgres://postgres:123456@postgresdb:5432/hackerrank_challenge
ENV NODE_ENV=prod
ENV PORT=8133

WORKDIR /app

EXPOSE 8133

CMD pm2-runtime server.js