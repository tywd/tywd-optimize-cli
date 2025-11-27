# 命令行参数

## 主命令

### check

检查项目性能优化项

```bash
# 全局安装后使用
optimize-cli check [options]

# 项目内安装后使用
npx optimize-cli check [options]
```

#### 选项

- `-p, --path <path>` - 指定项目路径 (默认: 当前目录)
- `-r, --report` - 生成Web报告
- `-v, --verbose` - 显示详细信息
- `-h, --help` - 显示帮助信息

#### 示例

```bash
# 在当前目录执行检测（全局安装后）
optimize-cli check

# 在当前目录执行检测（项目内安装后）
npx optimize-cli check

# 指定项目路径（全局安装后）
optimize-cli check --path ./my-project

# 指定项目路径（项目内安装后）
npx optimize-cli check --path ./my-project

# 生成报告并显示详细信息（全局安装后）
optimize-cli check --report --verbose

# 生成报告并显示详细信息（项目内安装后）
npx optimize-cli check --report --verbose

# 组合使用（全局安装后）
optimize-cli check --path ./my-project --report --verbose

# 组合使用（项目内安装后）
npx optimize-cli check --path ./my-project --report --verbose
```

### finish

完成优化建议（计划中）

```bash
# 全局安装后使用
optimize-cli finish

# 项目内安装后使用
npx optimize-cli finish
```

## 使用方式

### 全局安装后使用

安装完成后，可以在任何地方直接使用命令：

```bash
# 显示版本号
optimize-cli --version

# 显示帮助信息
optimize-cli --help

# 显示check命令的帮助信息
optimize-cli check --help
```

### 项目内安装后使用

项目内安装后，使用 `npx` 前缀来调用命令：

```bash
# 显示版本号
npx optimize-cli --version

# 显示帮助信息
npx optimize-cli --help

# 显示check命令的帮助信息
npx optimize-cli check --help
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

## 全局选项

- `-V, --version` - 显示版本号
- `-h, --help` - 显示帮助信息

## 使用示例

```bash
# 显示版本号（全局安装后）
optimize-cli --version

# 显示版本号（项目内安装后）
npx optimize-cli --version

# 显示帮助信息（全局安装后）
optimize-cli --help

# 显示帮助信息（项目内安装后）
npx optimize-cli --help

# 显示check命令的帮助信息（全局安装后）
optimize-cli check --help

# 显示check命令的帮助信息（项目内安装后）
npx optimize-cli check --help
```