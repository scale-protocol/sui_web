FROM nginx:1.17.3-alpine
LABEL MAINTAINER="tttlkkkl <lihuaio.com@gmail.com>"
ENV TZ "Asia/Shanghai"
ENV TERM xterm
RUN echo 'https://mirrors.aliyun.com/alpine/v3.8/main/' > /etc/apk/repositories && \
    echo 'https://mirrors.aliyun.com/alpine/v3.8/community/' >> /etc/apk/repositories
COPY ["build","/usr/share/nginx/html"]
WORKDIR /usr/share/nginx/html
RUN apk update && apk add --no-cache tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \ 
    && echo "Asia/Shanghai" > /etc/timezone 
EXPOSE 80