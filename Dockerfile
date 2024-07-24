FROM node:20.12.2-alpine
WORKDIR app/
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
COPY . ./
RUN pnpm run build
CMD ["node", "build", "--port", "80"]
