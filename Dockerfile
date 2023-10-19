FROM mcr.microsoft.com/playwright:v1.39.0-jammy

WORKDIR /app

COPY . ./


RUN npm install
RUN npx playwright install

CMD ['bash']
