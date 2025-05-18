# AI Chat Application

一个基于 React 和 OpenAI API 的聊天应用。

## 功能特点

- 实时聊天界面
- OpenAI GPT-3.5 集成
- 深色模式支持
- 消息历史保存
- 响应式设计
- 现代化 UI/UX

## 技术栈

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Heroicons
  - Vite

- Backend:
  - Node.js
  - Express
  - OpenAI API

## 安装步骤

1. 克隆项目：
   ```bash
   git clone <repository-url>
   cd aichat
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建环境配置文件：
   - 复制 `.env.example` 到 `.env`
   - 更新 `OPENAI_API_KEY` 为你的 OpenAI API 密钥

4. 启动开发服务器：

   前端（终端 1）：
   ```bash
   npm run dev
   ```

   后端（终端 2）：
   ```bash
   node server.js
   ```

5. 访问应用：
   - 前端：http://localhost:5173
   - 后端：http://localhost:3001

## 环境变量

- `PORT`: 后端服务器端口（默认：3001）
- `OPENAI_API_KEY`: OpenAI API 密钥
- `AI_MODEL`: OpenAI 模型名称（默认：gpt-3.5-turbo）
- `MAX_TOKENS`: 每次请求的最大 token 数（默认：2000）

## 使用说明

1. 在输入框中输入消息
2. 按 Enter 发送消息（Shift + Enter 换行）
3. 等待 AI 响应
4. 使用右上角按钮切换深色/浅色模式
5. 使用"清空对话"按钮清除聊天历史

## 开发说明

- 消息历史保存在浏览器的 localStorage 中
- 深色模式偏好也保存在 localStorage 中
- 所有 API 调用都通过后端代理，确保 API 密钥安全

## 注意事项

- 请确保有可用的 OpenAI API 密钥
- 注意 API 使用限制和费用
- 建议在生产环境中添加适当的速率限制
- 确保 API 密钥安全，不要提交到版本控制系统
