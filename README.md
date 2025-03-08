# React Theme for Typecho

一个现代化的 React 主题，为 Typecho 博客系统设计，支持深色模式和响应式设计。

## 特性

- **深色模式支持** - 自动根据时间（晚上7点至早上7点）切换或手动切换
- **响应式设计** - 完美适配各种屏幕尺寸
- **优雅的排版** - 使用 LXGW WenKai Screen 字体，提升中文阅读体验
- **现代化 UI** - 简洁美观的界面设计
- **评论系统** - 完整支持 Typecho 的评论功能
- **分类与标签** - 支持文章分类和标签展示
- **搜索功能** - 内置搜索功能

## 预览

### 亮色模式
![亮色模式预览](./light-mode-preview.png)

### 深色模式
![深色模式预览](./dark-mode-preview.png)

## 安装

1. 克隆仓库
```bash
git clone https://github.com/jkjoy/React-theme-typecho.git
```

2. 安装依赖
```bash
cd React-theme-typecho
npm install
```

3. 启动开发服务器
```bash
npm start
```

4. 构建生产版本
```bash
npm run build
```

## 配置

### Typecho 插件

https://github.com/jkjoy/typecho-plugin-Restful/releases/tag/v1.2.0
启用插件后，可以通过 `/api` 访问 Typecho 的 API。

### API 配置

在 `src/services/api.js` 文件中配置你的 Typecho **博客地址** 。

### 主题配置

主题相关的配置可以在 `src/index.css` 和 `src/App.css` 中修改。

## 主要组件

- **HomePage** - 博客首页
- **PostDetail** - 文章详情页
- **CategoryPosts** - 分类文章列表
- **TagPosts** - 标签文章列表
- **About** - 关于页面
- **CommentSection** - 评论区组件
- **Sidebar** - 侧边栏组件

## API 接口

本主题使用以下 API 接口：

- `/api/posts` - 获取文章列表
- `/api/post/{slug}` - 获取文章详情
- `/api/categories` - 获取分类列表
- `/api/tags` - 获取标签列表
- `/api/recentComments` - 获取最近评论
- `/api/comments/{postId}` - 获取文章评论
- `/api/postComment` - 发表评论

## 字体

本主题使用 [LXGW WenKai Screen](https://github.com/lxgw/LxgwWenKai) 字体，这是一款优秀的开源中文字体，特别适合屏幕阅读。

## 深色模式

深色模式会在以下情况自动启用：
- 晚上 7 点至早上 7 点
- 用户手动切换
- 系统设置为深色模式

## 贡献

欢迎提交 Pull Request 或创建 Issue 来改进这个主题。

## 许可

[MIT 许可证](LICENSE)
