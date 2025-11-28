#!/usr/bin/env node

// =============================================================================
// 模块导入
// =============================================================================

/**
 * 命令行参数解析库
 * @see https://github.com/tj/commander.js
 */
const { Command } = require('commander');

/**
 * 终端美化输出库
 * @see https://github.com/chalk/chalk
 */
const chalk = require('chalk');

/**
 * 终端旋转光标指示器
 * @see https://github.com/sindresorhus/ora
 */
const ora = require('ora');

/**
 * Node.js 路径处理模块
 */
const path = require('path');

/**
 * 文件系统扩展模块
 * @see https://github.com/jprichardson/node-fs-extra
 */
const fs = require('fs-extra');

/**
 * Node.js 性能测量模块
 */
const { performance } = require('perf_hooks');

// =============================================================================
// 配置与初始化
// =============================================================================

/**
 * 从 package.json 中读取版本号和其他元数据
 * 实现版本号的自动同步，避免手动维护
 */
const packageJson = require('../package.json');

/**
 * 创建 Commander 实例
 * 用于定义和解析命令行参数
 */
const program = new Command();

// =============================================================================
// 程序基本信息配置
// =============================================================================

/**
 * 配置程序基本信息
 * 包括版本号、描述和使用方法
 */
program
  .version(packageJson.version)
  .description('前端性能优化检测工具')
  .usage('<command> [options]');

// =============================================================================
// check 命令定义
// =============================================================================

/**
 * 定义 check 命令
 * 用于检查项目性能优化项
 */
program
  .command('check')
  .description('检查项目性能优化项')
  // 定义命令选项
  .option('-p, --path <path>', '指定项目路径', '.')
  .option('-r, --report', '生成Web报告')
  .option('-v, --verbose', '显示详细信息')
  // 定义命令执行函数
  .action(async (options) => {
    // 解析并规范化项目路径
    const projectPath = path.resolve(options.path);
    
    // 输出开始检测信息
    console.log(chalk.blue('🚀 开始检测项目性能优化项...'));
    console.log(chalk.gray(`📁 项目路径: ${projectPath}`));
    
    // 检查项目路径是否存在
    if (!fs.existsSync(projectPath)) {
      console.error(chalk.red('❌ 指定的项目路径不存在'));
      process.exit(1);
    }
    
    // 记录开始时间，用于计算检测耗时
    const startTime = performance.now();
    
    // 创建终端旋转光标指示器
    const spinner = ora('正在分析项目...').start();
    
    try {
      // 动态导入检测器模块
      // 使用 ES Module 语法确保在不同环境下都能正确加载
      const { OptimizerDetector } = await import('../lib/detector.js');
      
      // 创建检测器实例
      const detector = new OptimizerDetector(projectPath);
      
      // 执行所有检测项
      const results = await detector.detectAll();
      
      // 计算检测耗时并更新指示器状态
      const endTime = performance.now();
      spinner.succeed(`检测完成，耗时 ${(endTime - startTime).toFixed(2)}ms`);
      
      // 输出检测结果
      detector.printResults(results);
      
      // 如果需要生成报告，则生成Web报告
      if (options.report) {
        const reportPath = await detector.generateReport(results);
        console.log(chalk.green(`📊 检测报告已生成: ${reportPath}`));
        
        // 统计检测结果
        const totalItems = results.length;
        const warningItems = results.filter(item => item.status === 'warning').length;
        const passedItems = results.filter(item => item.status === 'passed').length;
        
        // 输出统计信息
        console.log('\n📈 检测统计:');
        console.log(chalk.green(`✅ 通过项: ${passedItems}/${totalItems}`));
        console.log(chalk.yellow(`⚠️  警告项: ${warningItems}/${totalItems}`));
        
        // 如果有警告项，提醒用户关注
        if (warningItems > 0) {
          console.log(chalk.red('\n💡 建议关注警告项，它们可能影响页面性能'));
        }
      }
      
      // 如果启用了详细模式且有警告项，则显示详细建议
      if (options.verbose && warningItems > 0) {
        console.log('\n📋 详细建议:');
        results.filter(item => item.status === 'warning').forEach(item => {
          console.log(chalk.yellow(`\n⚠️  ${item.item}`));
          console.log(chalk.gray(`   问题: ${item.message}`));
          console.log(chalk.green(`   建议: ${item.recommendation}`));
        });
      }
    } catch (error) {
      // 错误处理
      spinner.fail('检测过程中发生错误');
      console.error(chalk.red(error.message));
      
      // 如果是详细模式且有错误堆栈，则输出堆栈信息
      if (error.stack && program.opts().verbose) {
        console.error(chalk.gray(error.stack));
      }
      
      // 退出程序
      process.exit(1);
    }
  });

// =============================================================================
// finish 命令定义（占位符）
// =============================================================================

/**
 * 定义 finish 命令（占位符）
 * 用于完成优化建议，目前仍在开发中
 */
program
  .command('finish')
  .description('完成优化建议（计划中）')
  .action(() => {
    console.log(chalk.yellow('🚧 finish命令正在开发中...'));
  });

// =============================================================================
// 帮助信息扩展
// =============================================================================

/**
 * 扩展帮助信息
 * 添加使用示例，方便用户理解和使用
 */
program.on('--help', () => {
  console.log('');
  console.log('示例:');
  console.log('  $ optimize-cli check');
  console.log('  $ optimize-cli check --path ./my-project');
  console.log('  $ optimize-cli check --report');
  console.log('  $ optimize-cli check --path ./my-project --report --verbose');
  console.log('  $ optimize-cli finish');
});

// =============================================================================
// 程序启动
// =============================================================================

/**
 * 解析命令行参数并启动程序
 */
program.parse();