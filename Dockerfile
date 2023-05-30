FROM nginx:mainline-alpine3.17-slim
COPY ./build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]