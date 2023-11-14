FROM node:18-alpine
LABEL MAINTAINER="tttlkkkl <lihuaio.com@gmail.com>"
ENV TZ "Asia/Shanghai"
ENV TERM xterm
RUN echo 'https://mirrors.aliyun.com/alpine/v3.8/main/' > /etc/apk/repositories && \
    echo 'https://mirrors.aliyun.com/alpine/v3.8/community/' >> /etc/apk/repositories
COPY ["./","/app"]
WORKDIR /app
RUN yarn install
CMD [ "yarn","start" ]