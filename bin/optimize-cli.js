#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { performance } from 'perf_hooks';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .version('1.0.0')
  .description('前端性能优化检测工具')
  .usage('<command> [options]');

// 添加check命令
program
  .command('check')
  .description('检查项目性能优化项')
  .option('-p, --path <path>', '指定项目路径', '.')
  .option('-r, --report', '生成Web报告')
  .option('-v, --verbose', '显示详细信息')
  .action(async (options) => {
    const projectPath = path.resolve(options.path);
    console.log(chalk.blue('🚀 开始检测项目性能优化项...'));
    console.log(chalk.gray(`📁 项目路径: ${projectPath}`));
    
    // 检查项目路径是否存在
    if (!fs.existsSync(projectPath)) {
      console.error(chalk.red('❌ 指定的项目路径不存在'));
      process.exit(1);
    }
    
    const startTime = performance.now();
    const spinner = ora('正在分析项目...').start();
    
    try {
      // 导入检测器
      const { OptimizerDetector } = await import('../lib/detector.js');
      
      // 创建检测器实例
      const detector = new OptimizerDetector(projectPath);
      
      // 执行检测
      const results = await detector.detectAll();
      
      const endTime = performance.now();
      spinner.succeed(`检测完成，耗时 ${(endTime - startTime).toFixed(2)}ms`);
      
      // 输出结果
      detector.printResults(results);
      
      // 如果需要生成报告
      if (options.report) {
        const reportPath = await detector.generateReport(results);
        console.log(chalk.green(`📊 检测报告已生成: ${reportPath}`));
        
        // 统计信息
        const totalItems = results.length;
        const warningItems = results.filter(item => item.status === 'warning').length;
        const passedItems = results.filter(item => item.status === 'passed').length;
        
        console.log('\n📈 检测统计:');
        console.log(chalk.green(`✅ 通过项: ${passedItems}/${totalItems}`));
        console.log(chalk.yellow(`⚠️  警告项: ${warningItems}/${totalItems}`));
        
        if (warningItems > 0) {
          console.log(chalk.red('\n💡 建议关注警告项，它们可能影响页面性能'));
        }
      }
      
      // 如果有警告项且是详细模式，显示详细建议
      if (options.verbose && warningItems > 0) {
        console.log('\n📋 详细建议:');
        results.filter(item => item.status === 'warning').forEach(item => {
          console.log(chalk.yellow(`\n⚠️  ${item.item}`));
          console.log(chalk.gray(`   问题: ${item.message}`));
          console.log(chalk.green(`   建议: ${item.recommendation}`));
        });
      }
    } catch (error) {
      spinner.fail('检测过程中发生错误');
      console.error(chalk.red(error.message));
      if (error.stack && program.opts().verbose) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

// 添加finish命令占位符
program
  .command('finish')
  .description('完成优化建议（计划中）')
  .action(() => {
    console.log(chalk.yellow('🚧 finish命令正在开发中...'));
  });

// 添加帮助信息
program.on('--help', () => {
  console.log('');
  console.log('示例:');
  console.log('  $ optimize-cli check');
  console.log('  $ optimize-cli check --path ./my-project');
  console.log('  $ optimize-cli check --report');
  console.log('  $ optimize-cli check --path ./my-project --report --verbose');
  console.log('  $ optimize-cli finish');
});

program.parse();