# @tywd/optimize-cli

前端性能优化检测工具，根据优化清单自动化检测项目问题并生成可视化报告。

## 功能特性

- 🚀 一键检测项目中的性能优化问题
- 📊 可视化Web报告展示检测结果
- 📋 基于权威优化清单的检测规则
- 🔧 支持多种前端构建工具(Webpack/Vite等)
- 📚 为每个优化项提供详细的优化建议文档

## 安装

```bash
# 全局安装 (推荐使用 pnpm)
pnpm install -g @tywd/optimize-cli

# 也可以使用 npm 安装
npm install -g @tywd/optimize-cli

# 或者作为开发依赖安装
pnpm install -D @tywd/optimize-cli
# 或者
npm install -D @tywd/optimize-cli
```

## 使用方法

```bash
# 在项目根目录执行检测
optimize-cli check

# 指定项目路径
optimize-cli check --path ./your-project-path

# 生成Web报告
optimize-cli check --report

# 显示详细信息
optimize-cli check --verbose

# 组合使用
optimize-cli check --path ./your-project-path --report --verbose

# 其他命令（计划中）
optimize-cli finish
```

## 检测项

本工具基于以下优化清单的第一部分(工具可自动化检测的优化项)进行检测：

1. DNS解析阶段
   - DNS预解析配置
   - 合并域名数量

2. HTTP请求阶段
   - 合并JS/CSS小文件
   - 移除未使用资源
   - 图片格式优化与压缩
   - 代码压缩混淆
   - 静态资源加文件指纹
   - 非首屏CSS延迟加载
   - JS使用defer/async
   - 图片懒加载

3. 解析与渲染阶段
   - JS脚本位置优化
   - JS代码分割与动态加载
   - 避免使用@import引入CSS
   - 简化CSS选择器
   - CSS动画替代JS动画

4. 交互就绪阶段
   - 拆分JS长任务
   - 避免同步阻塞API
   - 第三方脚本优化加载
   - 预加载关键资源

5. 工程化落地阶段
   - 构建工具基础配置
   - 包体积异常检测

## 优化建议文档

工具为每个检测项提供了详细的优化建议文档，当生成Web报告时：
1. 报告中会包含每个警告项的具体优化建议
2. 点击"查看详细优化指南"链接可以直接查看该优化项的详细文档
3. 文档包含问题描述、优化建议、实施步骤、注意事项和验证方法
4. 所有文档托管在GitHub上，可以直接在浏览器中查看

## API

### 命令

- `check` - 检查项目性能优化项
- `finish` - 完成优化建议（计划中）

### check命令选项

- `-p, --path <path>` - 指定项目路径 (默认: 当前目录)
- `-r, --report` - 生成Web报告
- `-v, --verbose` - 显示详细信息
- `-h, --help` - 显示帮助信息

### 全局选项

- `-V, --version` - 显示版本号
- `-h, --help` - 显示帮助信息

## 开发

```bash
# 克隆项目
git clone https://github.com/tywd/optimize-cli.git

# 安装依赖 (推荐使用 pnpm)
cd optimize-cli
pnpm install

# 也可以使用 npm 安装
# npm install

# 链接CLI工具
pnpm link --global
# 或者
# npm link
```

## 文档和代码地址

- 项目代码仓库: https://github.com/tywd/optimize-cli
- 在线文档: https://tywd.github.io/optimize-cli

## License

MIT

## 支持

如果你觉得这个工具对你有帮助，请给它一个 star！⭐