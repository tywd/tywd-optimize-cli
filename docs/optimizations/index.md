# 前端性能优化检测工具

欢迎使用 [optimize-cli](https://github.com/tywd/optimize-cli) - 一款基于权威优化清单的前端性能优化检测工具。

## 功能特性

- 🚀 一键检测项目中的性能优化问题
- 📊 可视化Web报告展示检测结果
- 📋 基于权威优化清单的检测规则
- 🔧 支持多种前端构建工具(Webpack/Vite等)
- 📚 为每个优化项提供详细的优化建议文档

## 快速开始

### 安装

```bash
# 全局安装
npm install -g optimize-cli

# 或者作为开发依赖安装
npm install -D optimize-cli
```

### 使用

```bash
# 在项目根目录执行检测
optimize-cli check

# 生成Web报告
optimize-cli check --report

# 显示详细信息
optimize-cli check --verbose
```

## 文档导航

- [使用指南](/guide/usage) - 详细介绍如何安装和使用本工具
- [优化项详解](/optimizations/dns-prefetch) - 每个优化项的详细说明和优化建议
- [开发文档](/development/implementation) - 工具的实现过程和技术架构

## 支持

如果你觉得这个工具对你有帮助，请给它一个 star！⭐