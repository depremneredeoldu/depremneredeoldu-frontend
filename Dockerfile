FROM node:latest as build
WORKDIR /depremneredeoldu-frontend
COPY /depremneredeoldu-frontend .
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", ".", "-l", "80"]

