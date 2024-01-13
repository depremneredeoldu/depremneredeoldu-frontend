FROM node:latest as build
COPY . /app
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "app", "-l", "80"]

