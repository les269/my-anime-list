FROM nginx
COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /ect/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]