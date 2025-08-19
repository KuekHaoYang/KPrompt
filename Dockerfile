# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 定义构建参数
ARG GEMINI_API_KEY

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（构建需要 devDependencies）
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境阶段
FROM nginx:alpine

# 复制构建结果到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 使用默认 nginx 配置

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]