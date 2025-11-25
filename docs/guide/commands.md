# 命令行参数

## 主命令

### check

检查项目性能优化项

```bash
optimize-cli check [options]
```

#### 选项

- `-p, --path <path>` - 指定项目路径 (默认: 当前目录)
- `-r, --report` - 生成Web报告
- `-v, --verbose` - 显示详细信息
- `-h, --help` - 显示帮助信息

#### 示例

```bash
# 在当前目录执行检测
optimize-cli check

# 指定项目路径
optimize-cli check --path ./my-project

# 生成报告并显示详细信息
optimize-cli check --report --verbose

# 组合使用
optimize-cli check --path ./my-project --report --verbose
```

### finish

完成优化建议（计划中）

```bash
optimize-cli finish
```

## 全局选项

- `-V, --version` - 显示版本号
- `-h, --help` - 显示帮助信息

## 使用示例

```bash
# 显示版本号
optimize-cli --version

# 显示帮助信息
optimize-cli --help

# 显示check命令的帮助信息
optimize-cli check --help
```