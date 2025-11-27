# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2025-11-28

### Fixed

- 删除多余的空文件 optimize-cli.js
- 使版本号自动从 package.json 中读取，避免手动维护

## [1.0.5] - 2025-11-28

### Fixed

- 修复文档链接路径问题，将文档链接从.md扩展名更新为.html扩展名

## [1.0.2] - 2025-11-28

### Fixed

- 修复模块系统兼容性问题，支持在不同Node.js环境中运行
- 优化报告生成功能，确保在各种环境下都能正确生成HTML报告
- 修复文件扩展名问题，使用.cjs扩展名确保CommonJS模块正确加载

### Changed

- 更新bin文件扩展名从.js到.cjs以提高兼容性
- 移除ES模块语法，改用CommonJS语法以提高兼容性
- 优化错误处理和用户提示信息

## [1.0.1] - 2025-11-27

### Fixed

- 修复glob模块导入问题
- 修复报告生成中的链接路径问题
- 修复模块导入错误

### Changed

- 改进模块导入方式以提高兼容性
- 优化报告模板渲染逻辑
- 更新依赖项以提高稳定性

## [1.0.0] - 2025-11-24

### Added

- 初始化项目结构
- 实现21个优化项的检测功能
- 实现CLI命令行接口
- 实现Web报告生成功能
- 支持`optimize-cli check`命令格式