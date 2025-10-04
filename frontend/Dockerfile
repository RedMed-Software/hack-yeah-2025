FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:1.27-alpine
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
