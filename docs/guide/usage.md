# 安装与使用

## 安装

### 全局安装

```bash
npm install -g @tywd/optimize-cli
```

### 项目内安装

```bash
npm install -D @tywd/optimize-cli
```

## 基本使用

### 检测项目优化项

在项目根目录执行：

```bash
optimize-cli check
```

### 生成可视化报告

```bash
optimize-cli check --report
```

### 指定项目路径

```bash
optimize-cli check --path ./your-project-path
```

### 显示详细信息

```bash
optimize-cli check --verbose
```

### 组合使用

```bash
optimize-cli check --path ./your-project-path --report --verbose
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