FROM nginx
COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /ect/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]