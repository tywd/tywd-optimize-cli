# 安装与使用

## 安装

### 全局安装（推荐用于频繁使用）

全局安装后可以直接使用 `optimize-cli` 命令：

```bash
npm install -g @tywd/optimize-cli
# 或者使用 yarn
yarn global add @tywd/optimize-cli
# 或者使用 pnpm
pnpm install -g @tywd/optimize-cli
```

### 项目内安装（推荐用于单个项目使用）

项目内安装后需要通过 `npx` 来使用命令：

```bash
npm install -D @tywd/optimize-cli
# 或者使用 yarn
yarn add -D @tywd/optimize-cli
# 或者使用 pnpm
pnpm install -D @tywd/optimize-cli
```

## 使用方式

### 全局安装后使用

安装完成后，可以在任何地方直接使用命令：

```bash
# 检测项目优化项
optimize-cli check

# 生成可视化报告
optimize-cli check --report

# 指定项目路径
optimize-cli check --path ./your-project-path

# 显示详细信息
optimize-cli check --verbose
```

### 项目内安装后使用

项目内安装后，使用 `npx` 前缀来调用命令：

```bash
# 检测项目优化项
npx optimize-cli check

# 生成可视化报告
npx optimize-cli check --report

# 指定项目路径
npx optimize-cli check --path ./your-project-path

# 显示详细信息
npx optimize-cli check --verbose
```

### 通过 package.json 脚本使用（推荐）

为了更方便地使用，可以在项目的 `package.json` 中添加自定义脚本：

```json
{
  "scripts": {
    "optimize": "optimize-cli",
    "optimize:check": "optimize-cli check",
    "optimize:report": "optimize-cli check --report",
    "optimize:verbose": "optimize-cli check --verbose"
  }
}
```

然后使用 npm/yarn/pnpm 运行：

```bash
# 使用 npm
npm run optimize:check
npm run optimize:report
npm run optimize -- --version

# 使用 yarn
yarn optimize:check
yarn optimize:report
yarn optimize --version

# 使用 pnpm
pnpm optimize:check
pnpm optimize:report
pnpm optimize --version
```

## 兼容性说明

### Node.js 模块系统兼容性

@tywd/optimize-cli 工具完全兼容不同的 Node.js 模块系统：

1. **CommonJS 项目**：工具在传统的 CommonJS 项目中可以正常工作
2. **ES Module 项目**：工具在设置了 `"type": "module"` 的 ES Module 项目中也可以正常工作

这种兼容性是通过以下方式实现的：
- 使用 `.cjs` 扩展名确保入口文件被正确识别为 CommonJS 模块
- 在入口文件中使用 CommonJS 语法 (`require()`)
- 通过动态导入方式加载其他模块

无论您的项目使用哪种模块系统，都可以正常安装和使用本工具。

## 基本使用

### 检测项目优化项

在项目根目录执行：

```bash
# 全局安装后
optimize-cli check

# 项目内安装后
npx optimize-cli check
```

### 生成可视化报告

```bash
# 全局安装后
optimize-cli check --report

# 项目内安装后
npx optimize-cli check --report
```

### 指定项目路径

```bash
# 全局安装后
optimize-cli check --path ./your-project-path

# 项目内安装后
npx optimize-cli check --path ./your-project-path
```

### 显示详细信息

```bash
# 全局安装后
optimize-cli check --verbose

# 项目内安装后
npx optimize-cli check --verbose
```

### 组合使用

```bash
# 全局安装后
optimize-cli check --path ./your-project-path --report --verbose

# 项目内安装后
npx optimize-cli check --path ./your-project-path --report --verbose
```

## 命令行参数详解

| 参数 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| --path | -p | 指定项目路径 | 当前目录 |
| --report | -r | 生成Web报告 | false |
| --verbose | -v | 显示详细信息 | false |
| --help | -h | 显示帮助信息 | - |
| --version | -V | 显示版本号 | - |

## 报告查看

生成报告后，工具会自动启动VitePress文档站点，您可以在浏览器中查看详细的检测结果和优化建议。