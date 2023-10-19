FROM mcr.microsoft.com/playwright:v1.39.0-jammy

WORKDIR /app

COPY . ./


RUN npm install
RUN npx playwright install
RUN apt-get update ; apt-get install -y openjdk-11-jdk ; export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 ; npm install --save-dev allure-commandline

CMD ['bash']
