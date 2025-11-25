const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const ejs = require('ejs');
const { exec } = require('child_process');

class OptimizerDetector {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.results = [];
    this.vitepressPort = 5173; // 默认端口
  }

  /**
   * 设置VitePress端口
   */
  setVitepressPort(port) {
    this.vitepressPort = port;
  }

  /**
   * 执行所有检测项
   */
  async detectAll() {
    // DNS解析阶段
    await this.checkDNSPrefetch();
    await this.checkDomainCount();
    
    // HTTP请求阶段
    await this.checkSmallFiles();
    await this.checkUnusedResources();
    await this.checkImageOptimization();
    await this.checkCodeMinification();
    await this.checkFileFingerprints();
    await this.checkCSSDeferredLoading();
    await this.checkJSAsyncDefer();
    await this.checkImageLazyLoading();
    
    // 解析与渲染阶段
    await this.checkJSScriptPosition();
    await this.checkCodeSplitting();
    await this.checkCSSImport();
    await this.checkComplexSelectors();
    await this.checkCSSAnimations();
    
    // 交互就绪阶段
    await this.checkLongTasks();
    await this.checkBlockingAPIs();
    await this.checkThirdPartyScripts();
    await this.checkResourcePreloading();
    
    // 工程化落地阶段
    await this.checkBuildConfigurations();
    await this.checkBundleSize();
    
    return this.results;
  }

  /**
   * 添加检测结果
   */
  addResult(category, item, status, message, recommendation = '') {
    // 为每个优化项生成对应的文档链接
    const docLinks = {
      'DNS预解析配置': 'optimizations/dns-prefetch',
      '合并域名数量': 'optimizations/domain-consolidation',
      '合并JS/CSS小文件': 'optimizations/small-file-merge',
      '移除未使用资源': 'optimizations/remove-unused-resources',
      '图片格式优化与压缩': 'optimizations/image-optimization',
      '代码压缩混淆': 'optimizations/code-minification',
      '静态资源加文件指纹': 'optimizations/file-fingerprint',
      '非首屏CSS延迟加载': 'optimizations/css-deferred-loading',
      'JS使用defer/async': 'optimizations/js-defer-async',
      '图片懒加载': 'optimizations/image-lazy-loading',
      'JS脚本位置优化': 'optimizations/js-script-position',
      'JS代码分割与动态加载': 'optimizations/js-code-splitting',
      '避免使用@import引入CSS': 'optimizations/css-import-avoidance',
      '简化CSS选择器': 'optimizations/css-selector-simplification',
      'CSS动画替代JS动画': 'optimizations/css-animation-substitution',
      '拆分JS长任务': 'optimizations/js-long-task-splitting',
      '避免同步阻塞API': 'optimizations/avoid-blocking-api',
      '第三方脚本优化加载': 'optimizations/third-party-script-optimization',
      '预加载关键资源': 'optimizations/resource-preloading',
      '构建工具基础配置': 'optimizations/build-tool-configuration',
      '包体积异常检测': 'optimizations/bundle-size-optimization'
    };
    
    const docPath = docLinks[item] || '';
    
    this.results.push({
      category,
      item,
      status,
      message,
      recommendation,
      docPath
    });
  }

  // ==================== DNS解析阶段 ====================
  
  /**
   * 检查DNS预解析配置
   */
  async checkDNSPrefetch() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasDNSPrefetch = false;
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        if (content.includes('rel="dns-prefetch"') || content.includes("rel='dns-prefetch'")) {
          hasDNSPrefetch = true;
          break;
        }
      }
      
      if (hasDNSPrefetch) {
        this.addResult(
          'DNS解析阶段',
          'DNS预解析配置',
          'passed',
          '项目中已配置DNS预解析'
        );
      } else {
        this.addResult(
          'DNS解析阶段',
          'DNS预解析配置',
          'warning',
          '未发现DNS预解析配置',
          '建议在HTML的<head>标签中添加<link rel="dns-prefetch" href="//example.com">来预解析重要域名'
        );
      }
    } catch (error) {
      this.addResult(
        'DNS解析阶段',
        'DNS预解析配置',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查域名数量
   */
  async checkDomainCount() {
    try {
      // 查找静态资源文件
      const staticFiles = glob.sync(
        '**/*.{js,css,png,jpg,jpeg,gif,svg,woff,woff2}', 
        { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] }
      );
      
      const domains = new Set();
      staticFiles.forEach(file => {
        // 简单提取文件路径中的域名特征（实际项目中可能需要更复杂的解析）
        const parts = file.split('/');
        if (parts.length > 1 && !parts[0].includes('.')) {
          domains.add(parts[0]);
        }
      });
      
      const domainCount = domains.size;
      
      if (domainCount <= 2) {
        this.addResult(
          'DNS解析阶段',
          '合并域名数量',
          'passed',
          `静态资源域名数量合理: ${domainCount}个`
        );
      } else if (domainCount <= 3) {
        this.addResult(
          'DNS解析阶段',
          '合并域名数量',
          'warning',
          `静态资源域名数量较多: ${domainCount}个`,
          '建议将静态资源域名合并到2个以内以减少DNS解析开销'
        );
      } else {
        this.addResult(
          'DNS解析阶段',
          '合并域名数量',
          'warning',
          `静态资源域名数量过多: ${domainCount}个`,
          '建议将静态资源域名合并到2个以内以减少DNS解析开销'
        );
      }
    } catch (error) {
      this.addResult(
        'DNS解析阶段',
        '合并域名数量',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  // ==================== HTTP请求阶段 ====================
  
  /**
   * 检查小文件合并
   */
  async checkSmallFiles() {
    try {
      // 查找构建产物目录
      const distPaths = ['dist', 'build', 'out'];
      let distPath = '';
      
      for (const p of distPaths) {
        if (await fs.pathExists(path.join(this.projectPath, p))) {
          distPath = path.join(this.projectPath, p);
          break;
        }
      }
      
      if (!distPath) {
        this.addResult(
          'HTTP请求阶段',
          '合并JS/CSS小文件',
          'warning',
          '未找到构建产物目录(dist/build/out)',
          '请先构建项目再进行检测'
        );
        return;
      }
      
      // 查找小于10KB的JS/CSS文件
      const smallFiles = glob.sync(
        '**/*.{js,css}', 
        { 
          cwd: distPath,
          ignore: ['node_modules/**']
        }
      ).filter(file => {
        const stat = fs.statSync(path.join(distPath, file));
        return stat.size > 0 && stat.size < 10 * 1024; // 小于10KB
      });
      
      if (smallFiles.length <= 3) {
        this.addResult(
          'HTTP请求阶段',
          '合并JS/CSS小文件',
          'passed',
          `小文件数量合理: ${smallFiles.length}个`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '合并JS/CSS小文件',
          'warning',
          `存在较多小文件: ${smallFiles.length}个`,
          '建议配置webpack/vite的splitChunks选项来合并小文件，减少HTTP请求数量'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '合并JS/CSS小文件',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查未使用的资源
   */
  async checkUnusedResources() {
    try {
      // 这里模拟检查，实际项目中可能需要集成Coverage API或其他工具
      const jsFiles = glob.sync('**/*.js', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      const cssFiles = glob.sync('**/*.css', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      // 简单检查是否存在大量未引用的文件
      if (jsFiles.length > 50 || cssFiles.length > 20) {
        this.addResult(
          'HTTP请求阶段',
          '移除未使用资源',
          'warning',
          `可能存在未使用的资源文件(JS:${jsFiles.length}个, CSS:${cssFiles.length}个)`,
          '建议使用Webpack Bundle Analyzer等工具分析并移除未使用的代码'
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '移除未使用资源',
          'passed',
          '资源文件数量在合理范围内'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '移除未使用资源',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查图片优化
   */
  async checkImageOptimization() {
    try {
      const imageFiles = glob.sync(
        '**/*.{png,jpg,jpeg,gif,webp,avif}', 
        { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] }
      );
      
      let modernFormatCount = 0;
      imageFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.webp' || ext === '.avif') {
          modernFormatCount++;
        }
      });
      
      const totalCount = imageFiles.length;
      
      if (totalCount === 0) {
        this.addResult(
          'HTTP请求阶段',
          '图片格式优化与压缩',
          'passed',
          '项目中未发现图片资源'
        );
      } else if (modernFormatCount / totalCount >= 0.5) {
        this.addResult(
          'HTTP请求阶段',
          '图片格式优化与压缩',
          'passed',
          `现代图片格式使用率较高: ${modernFormatCount}/${totalCount}`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '图片格式优化与压缩',
          'warning',
          `现代图片格式使用率较低: ${modernFormatCount}/${totalCount}`,
          '建议使用WebP或AVIF格式替代传统格式以减小图片体积'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '图片格式优化与压缩',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查代码压缩混淆
   */
  async checkCodeMinification() {
    try {
      // 查找构建产物目录
      const distPaths = ['dist', 'build', 'out'];
      let distPath = '';
      
      for (const p of distPaths) {
        if (await fs.pathExists(path.join(this.projectPath, p))) {
          distPath = path.join(this.projectPath, p);
          break;
        }
      }
      
      if (!distPath) {
        this.addResult(
          'HTTP请求阶段',
          '代码压缩混淆',
          'warning',
          '未找到构建产物目录(dist/build/out)',
          '请先构建项目再进行检测'
        );
        return;
      }
      
      // 查找JS/CSS文件
      const files = glob.sync(
        '**/*.{js,css}', 
        { 
          cwd: distPath,
          ignore: ['node_modules/**']
        }
      );
      
      let minifiedCount = 0;
      files.forEach(file => {
        // 检查文件名是否包含.min.或.min标识
        if (file.includes('.min.') || path.basename(file, path.extname(file)).endsWith('.min')) {
          minifiedCount++;
        }
      });
      
      if (files.length === 0) {
        this.addResult(
          'HTTP请求阶段',
          '代码压缩混淆',
          'passed',
          '未发现JS/CSS文件'
        );
      } else if (minifiedCount / files.length >= 0.8) {
        this.addResult(
          'HTTP请求阶段',
          '代码压缩混淆',
          'passed',
          `大部分文件已压缩: ${minifiedCount}/${files.length}`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '代码压缩混淆',
          'warning',
          `部分文件未压缩: ${minifiedCount}/${files.length}`,
          '建议配置Terser或cssnano等工具进行代码压缩'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '代码压缩混淆',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查文件指纹
   */
  async checkFileFingerprints() {
    try {
      // 查找构建产物目录
      const distPaths = ['dist', 'build', 'out'];
      let distPath = '';
      
      for (const p of distPaths) {
        if (await fs.pathExists(path.join(this.projectPath, p))) {
          distPath = path.join(this.projectPath, p);
          break;
        }
      }
      
      if (!distPath) {
        this.addResult(
          'HTTP请求阶段',
          '静态资源加文件指纹',
          'warning',
          '未找到构建产物目录(dist/build/out)',
          '请先构建项目再进行检测'
        );
        return;
      }
      
      // 查找JS/CSS文件
      const files = glob.sync(
        '**/*.{js,css}', 
        { 
          cwd: distPath,
          ignore: ['node_modules/**']
        }
      );
      
      let fingerprintCount = 0;
      files.forEach(file => {
        // 检查文件名是否包含hash/contenthash/chunkhash
        const basename = path.basename(file, path.extname(file));
        if (basename.includes('-') && basename.split('-').pop().length >= 8) {
          fingerprintCount++;
        }
      });
      
      if (files.length === 0) {
        this.addResult(
          'HTTP请求阶段',
          '静态资源加文件指纹',
          'passed',
          '未发现JS/CSS文件'
        );
      } else if (fingerprintCount / files.length >= 0.8) {
        this.addResult(
          'HTTP请求阶段',
          '静态资源加文件指纹',
          'passed',
          `大部分文件已添加指纹: ${fingerprintCount}/${files.length}`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '静态资源加文件指纹',
          'warning',
          `部分文件未添加指纹: ${fingerprintCount}/${files.length}`,
          '建议在构建配置中启用文件指纹功能，如webpack的[contenthash]或vite的[hash]'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '静态资源加文件指纹',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查CSS延迟加载
   */
  async checkCSSDeferredLoading() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasDeferredCSS = false;
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查是否有media="print"且包含onload修改媒体属性的CSS链接
        if (content.includes('media="print"') && content.includes('onload')) {
          hasDeferredCSS = true;
          break;
        }
      }
      
      if (hasDeferredCSS) {
        this.addResult(
          'HTTP请求阶段',
          '非首屏CSS延迟加载',
          'passed',
          '项目中已配置CSS延迟加载'
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '非首屏CSS延迟加载',
          'warning',
          '未发现CSS延迟加载配置',
          '建议对非首屏CSS使用media="print"配合onload="this.media=\'all\'"实现延迟加载'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '非首屏CSS延迟加载',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查JS的async/defer属性
   */
  async checkJSAsyncDefer() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let syncScriptCount = 0;
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 查找没有async或defer属性的script标签
        const matches = content.match(/<script(?![^>]*\b(?:async|defer)\b)[^>]*>(.*?)<\/script>/gis);
        if (matches) {
          syncScriptCount += matches.length;
        }
      }
      
      if (syncScriptCount <= 2) {
        this.addResult(
          'HTTP请求阶段',
          'JS使用defer/async',
          'passed',
          `同步脚本数量合理: ${syncScriptCount}个`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          'JS使用defer/async',
          'warning',
          `存在较多同步脚本: ${syncScriptCount}个`,
          '建议对非关键脚本使用async或defer属性避免阻塞HTML解析'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        'JS使用defer/async',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查图片懒加载
   */
  async checkImageLazyLoading() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let lazyImageCount = 0;
      let totalImageCount = 0;
      
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 查找img标签
        const imgMatches = content.match(/<img[^>]*>/gi);
        if (imgMatches) {
          totalImageCount += imgMatches.length;
          imgMatches.forEach(img => {
            // 检查是否有loading="lazy"属性
            if (img.includes('loading="lazy"') || img.includes("loading='lazy'")) {
              lazyImageCount++;
            }
          });
        }
      }
      
      if (totalImageCount === 0) {
        this.addResult(
          'HTTP请求阶段',
          '图片懒加载',
          'passed',
          '未发现图片资源'
        );
      } else if (lazyImageCount / totalImageCount >= 0.5) {
        this.addResult(
          'HTTP请求阶段',
          '图片懒加载',
          'passed',
          `懒加载图片比例较高: ${lazyImageCount}/${totalImageCount}`
        );
      } else {
        this.addResult(
          'HTTP请求阶段',
          '图片懒加载',
          'warning',
          `懒加载图片比例较低: ${lazyImageCount}/${totalImageCount}`,
          '建议对非首屏图片使用loading="lazy"属性实现懒加载'
        );
      }
    } catch (error) {
      this.addResult(
        'HTTP请求阶段',
        '图片懒加载',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  // ==================== 解析与渲染阶段 ====================
  
  /**
   * 检查JS脚本位置
   */
  async checkJSScriptPosition() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let headScriptCount = 0;
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查head标签中的script标签
        const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) {
          const headContent = headMatch[1];
          const scriptMatches = headContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
          if (scriptMatches) {
            headScriptCount += scriptMatches.length;
          }
        }
      }
      
      if (headScriptCount === 0) {
        this.addResult(
          '解析与渲染阶段',
          'JS脚本位置优化',
          'passed',
          '未在head标签中发现脚本'
        );
      } else if (headScriptCount <= 2) {
        this.addResult(
          '解析与渲染阶段',
          'JS脚本位置优化',
          'warning',
          `head标签中存在少量脚本: ${headScriptCount}个`,
          '建议将非关键脚本移至body底部以避免阻塞HTML解析'
        );
      } else {
        this.addResult(
          '解析与渲染阶段',
          'JS脚本位置优化',
          'warning',
          `head标签中存在较多脚本: ${headScriptCount}个`,
          '建议将非关键脚本移至body底部以避免阻塞HTML解析'
        );
      }
    } catch (error) {
      this.addResult(
        '解析与渲染阶段',
        'JS脚本位置优化',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查代码分割与动态加载
   */
  async checkCodeSplitting() {
    try {
      const jsFiles = glob.sync('**/*.js', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasDynamicImport = false;
      for (const file of jsFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查是否使用了动态导入
        if (content.includes('import(') || content.includes('require.ensure')) {
          hasDynamicImport = true;
          break;
        }
      }
      
      if (hasDynamicImport) {
        this.addResult(
          '解析与渲染阶段',
          'JS代码分割与动态加载',
          'passed',
          '项目中已使用动态导入实现代码分割'
        );
      } else {
        this.addResult(
          '解析与渲染阶段',
          'JS代码分割与动态加载',
          'warning',
          '未发现动态导入使用',
          '建议使用import()语法实现路由或组件级别的代码分割'
        );
      }
    } catch (error) {
      this.addResult(
        '解析与渲染阶段',
        'JS代码分割与动态加载',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查CSS中的@import
   */
  async checkCSSImport() {
    try {
      const cssFiles = glob.sync('**/*.css', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let importCount = 0;
      for (const file of cssFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查@import语句（排除第三方库）
        const importMatches = content.match(/@import\s+(?:url\()?['"][^'"]*['"]/gi);
        if (importMatches) {
          importCount += importMatches.length;
        }
      }
      
      if (importCount === 0) {
        this.addResult(
          '解析与渲染阶段',
          '避免使用@import引入CSS',
          'passed',
          '未发现CSS中的@import语句'
        );
      } else {
        this.addResult(
          '解析与渲染阶段',
          '避免使用@import引入CSS',
          'warning',
          `发现${importCount}个@import语句`,
          '建议使用link标签替代@import以避免阻塞CSS解析'
        );
      }
    } catch (error) {
      this.addResult(
        '解析与渲染阶段',
        '避免使用@import引入CSS',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查复杂CSS选择器
   */
  async checkComplexSelectors() {
    try {
      const cssFiles = glob.sync('**/*.css', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let complexSelectorCount = 0;
      let totalSelectorCount = 0;
      
      for (const file of cssFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 简单匹配复杂选择器（包含多个嵌套层级或伪类）
        const selectorMatches = content.match(/[^{}]*\{[^}]*\}/g);
        if (selectorMatches) {
          selectorMatches.forEach(selector => {
            // 检查选择器复杂度（简单规则：包含>、+、~或多个类名）
            const selectorPart = selector.split('{')[0].trim();
            if (selectorPart.includes('>') || selectorPart.includes('+') || 
                selectorPart.includes('~') || (selectorPart.match(/\./g) || []).length > 2) {
              complexSelectorCount++;
            }
            totalSelectorCount++;
          });
        }
      }
      
      if (totalSelectorCount === 0) {
        this.addResult(
          '解析与渲染阶段',
          '简化CSS选择器',
          'passed',
          '未发现CSS选择器'
        );
      } else if (complexSelectorCount / totalSelectorCount < 0.1) {
        this.addResult(
          '解析与渲染阶段',
          '简化CSS选择器',
          'passed',
          `复杂选择器比例较低: ${complexSelectorCount}/${totalSelectorCount}`
        );
      } else {
        this.addResult(
          '解析与渲染阶段',
          '简化CSS选择器',
          'warning',
          `复杂选择器比例较高: ${complexSelectorCount}/${totalSelectorCount}`,
          '建议简化复杂选择器以提高CSS解析性能'
        );
      }
    } catch (error) {
      this.addResult(
        '解析与渲染阶段',
        '简化CSS选择器',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查CSS动画替代JS动画
   */
  async checkCSSAnimations() {
    try {
      const jsFiles = glob.sync('**/*.js', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      const cssFiles = glob.sync('**/*.css', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasJSAnimation = false;
      let hasCSSAnimation = false;
      
      // 检查JS中的动画操作
      for (const file of jsFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查是否直接操作布局属性（如width, height, left, top等）
        if (content.includes('.style.') && 
            (content.includes('width') || content.includes('height') || 
             content.includes('left') || content.includes('top') || 
             content.includes('margin') || content.includes('padding'))) {
          hasJSAnimation = true;
          break;
        }
      }
      
      // 检查CSS中的动画属性
      for (const file of cssFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        if (content.includes('animation:') || content.includes('transform:') || 
            content.includes('@keyframes')) {
          hasCSSAnimation = true;
          break;
        }
      }
      
      if (!hasJSAnimation) {
        this.addResult(
          '解析与渲染阶段',
          'CSS动画替代JS动画',
          'passed',
          '未发现直接操作布局属性的JS动画'
        );
      } else if (hasCSSAnimation) {
        this.addResult(
          '解析与渲染阶段',
          'CSS动画替代JS动画',
          'warning',
          '发现JS动画操作，但已使用CSS动画',
          '建议优先使用CSS动画替代JS动画以提高性能'
        );
      } else {
        this.addResult(
          '解析与渲染阶段',
          'CSS动画替代JS动画',
          'warning',
          '发现JS动画操作且未使用CSS动画',
          '建议使用CSS transform和animation替代JS动画以提高性能'
        );
      }
    } catch (error) {
      this.addResult(
        '解析与渲染阶段',
        'CSS动画替代JS动画',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  // ==================== 交互就绪阶段 ====================
  
  /**
   * 检查长任务拆分
   */
  async checkLongTasks() {
    try {
      const jsFiles = glob.sync('**/*.js', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasLongTaskHandling = false;
      for (const file of jsFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查是否使用了任务拆分技术
        if (content.includes('setTimeout') && content.includes('0') || 
            content.includes('requestIdleCallback') || 
            content.includes('requestAnimationFrame')) {
          hasLongTaskHandling = true;
          break;
        }
      }
      
      if (hasLongTaskHandling) {
        this.addResult(
          '交互就绪阶段',
          '拆分JS长任务',
          'passed',
          '项目中已使用任务拆分技术'
        );
      } else {
        this.addResult(
          '交互就绪阶段',
          '拆分JS长任务',
          'warning',
          '未发现长任务拆分处理',
          '建议使用setTimeout、requestIdleCallback或requestAnimationFrame拆分长任务'
        );
      }
    } catch (error) {
      this.addResult(
        '交互就绪阶段',
        '拆分JS长任务',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查阻塞API
   */
  async checkBlockingAPIs() {
    try {
      const jsFiles = glob.sync('**/*.js', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasBlockingAPI = false;
      for (const file of jsFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 检查是否使用了阻塞API
        if (content.includes('alert(') || content.includes('confirm(') || 
            content.includes('prompt(') || 
            (content.includes('XMLHttpRequest') && content.includes('false'))) {
          hasBlockingAPI = true;
          break;
        }
      }
      
      if (!hasBlockingAPI) {
        this.addResult(
          '交互就绪阶段',
          '避免同步阻塞API',
          'passed',
          '未发现同步阻塞API调用'
        );
      } else {
        this.addResult(
          '交互就绪阶段',
          '避免同步阻塞API',
          'warning',
          '发现同步阻塞API调用',
          '建议避免使用alert、confirm、prompt等阻塞API'
        );
      }
    } catch (error) {
      this.addResult(
        '交互就绪阶段',
        '避免同步阻塞API',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查第三方脚本加载
   */
  async checkThirdPartyScripts() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let asyncScriptCount = 0;
      let totalScriptCount = 0;
      
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        // 查找script标签
        const scriptMatches = content.match(/<script[^>]*>/gi);
        if (scriptMatches) {
          totalScriptCount += scriptMatches.length;
          scriptMatches.forEach(script => {
            // 检查是否有async或defer属性
            if (script.includes('async') || script.includes('defer')) {
              asyncScriptCount++;
            }
          });
        }
      }
      
      if (totalScriptCount === 0) {
        this.addResult(
          '交互就绪阶段',
          '第三方脚本优化加载',
          'passed',
          '未发现脚本标签'
        );
      } else if (asyncScriptCount / totalScriptCount >= 0.5) {
        this.addResult(
          '交互就绪阶段',
          '第三方脚本优化加载',
          'passed',
          `异步加载脚本比例较高: ${asyncScriptCount}/${totalScriptCount}`
        );
      } else {
        this.addResult(
          '交互就绪阶段',
          '第三方脚本优化加载',
          'warning',
          `异步加载脚本比例较低: ${asyncScriptCount}/${totalScriptCount}`,
          '建议对第三方脚本使用async或defer属性实现异步加载'
        );
      }
    } catch (error) {
      this.addResult(
        '交互就绪阶段',
        '第三方脚本优化加载',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查资源预加载
   */
  async checkResourcePreloading() {
    try {
      const htmlFiles = glob.sync('**/*.html', { cwd: this.projectPath, ignore: ['node_modules/**', 'dist/**'] });
      
      let hasPreload = false;
      for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(this.projectPath, file), 'utf-8');
        if (content.includes('rel="preload"') || content.includes("rel='preload'")) {
          hasPreload = true;
          break;
        }
      }
      
      if (hasPreload) {
        this.addResult(
          '交互就绪阶段',
          '预加载关键资源',
          'passed',
          '项目中已配置资源预加载'
        );
      } else {
        this.addResult(
          '交互就绪阶段',
          '预加载关键资源',
          'warning',
          '未发现资源预加载配置',
          '建议对关键资源使用<link rel="preload">实现预加载'
        );
      }
    } catch (error) {
      this.addResult(
        '交互就绪阶段',
        '预加载关键资源',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  // ==================== 工程化落地阶段 ====================
  
  /**
   * 检查构建工具配置
   */
  async checkBuildConfigurations() {
    try {
      const configFiles = [
        'webpack.config.js',
        'vite.config.js',
        'rollup.config.js',
        'vue.config.js',
        'angular.json',
        'next.config.js',
        'nuxt.config.js'
      ];
      
      let hasConfigFile = false;
      for (const configFile of configFiles) {
        if (await fs.pathExists(path.join(this.projectPath, configFile))) {
          hasConfigFile = true;
          break;
        }
      }
      
      if (hasConfigFile) {
        this.addResult(
          '工程化落地阶段',
          '构建工具基础配置',
          'passed',
          '发现构建工具配置文件'
        );
      } else {
        this.addResult(
          '工程化落地阶段',
          '构建工具基础配置',
          'warning',
          '未发现构建工具配置文件',
          '建议配置构建工具以启用Tree Shaking、压缩、指纹等优化功能'
        );
      }
    } catch (error) {
      this.addResult(
        '工程化落地阶段',
        '构建工具基础配置',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  /**
   * 检查包体积
   */
  async checkBundleSize() {
    try {
      // 查找package.json文件
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        this.addResult(
          '工程化落地阶段',
          '包体积异常检测',
          'warning',
          '未发现package.json文件'
        );
        return;
      }
      
      const packageJson = await fs.readJson(packageJsonPath);
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      const totalDeps = dependencies.length + devDependencies.length;
      
      if (totalDeps <= 30) {
        this.addResult(
          '工程化落地阶段',
          '包体积异常检测',
          'passed',
          `依赖数量合理: ${totalDeps}个`
        );
      } else if (totalDeps <= 50) {
        this.addResult(
          '工程化落地阶段',
          '包体积异常检测',
          'warning',
          `依赖数量较多: ${totalDeps}个`,
          '建议检查是否有冗余依赖，使用webpack-bundle-analyzer分析包体积'
        );
      } else {
        this.addResult(
          '工程化落地阶段',
          '包体积异常检测',
          'warning',
          `依赖数量过多: ${totalDeps}个`,
          '建议检查是否有冗余依赖，使用webpack-bundle-analyzer分析包体积'
        );
      }
    } catch (error) {
      this.addResult(
        '工程化落地阶段',
        '包体积异常检测',
        'warning',
        `检查过程中出现错误: ${error.message}`
      );
    }
  }

  // ==================== 输出结果 ====================
  
  /**
   * 打印检测结果
   */
  printResults(results) {
    console.log('\n🔍 检测结果:');
    
    // 按类别分组显示
    const categories = [...new Set(results.map(r => r.category))];
    
    categories.forEach(category => {
      const categoryResults = results.filter(r => r.category === category);
      console.log(`\n📂 ${category}:`);
      
      categoryResults.forEach(result => {
        if (result.status === 'passed') {
          console.log(`  ✅ ${result.item}: ${result.message}`);
        } else {
          console.log(`  ⚠️  ${result.item}: ${result.message}`);
          if (result.recommendation) {
            console.log(`     💡 建议: ${result.recommendation}`);
            if (result.docPath) {
              console.log(`     📚 详细文档: https://github.com/tywd/optimize-cli/blob/main/docs/${result.docPath}.md`);
            }
          }
        }
      });
    });
  }

  /**
   * 生成Web报告并在浏览器中打开
   */
  async generateReport(results) {
    // 读取报告模板
    const templatePath = path.join(__dirname, '../templates/report.ejs');
    let template;
    
    try {
      template = await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      // 使用默认模板字符串
      template = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>前端性能优化检测报告</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0; 
            padding: 20px; 
            background-color: #f5f7fa;
            color: #303133;
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            padding: 30px 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            border-radius: 8px; 
            margin-bottom: 30px; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .summary { 
            display: flex; 
            justify-content: space-around; 
            margin-bottom: 30px; 
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .summary-item { 
            text-align: center; 
        }
        .passed { color: #67c23a; }
        .warning { color: #e6a23c; }
        .category { 
            margin-bottom: 30px; 
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .category-header { 
            padding: 15px 20px; 
            background-color: #f8f9fa; 
            border-bottom: 1px solid #dcdfe6; 
            font-weight: bold;
            font-size: 1.2em;
        }
        .items { 
            padding: 0; 
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }
        th, td {
            border: 1px solid #dcdfe6;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f5f7fa;
            font-weight: bold;
        }
        .status-passed {
            color: #67c23a;
            font-weight: bold;
        }
        .status-warning {
            color: #e6a23c;
            font-weight: bold;
        }
        .recommendation {
            background-color: #fff8e1;
            border-left: 3px solid #e6a23c;
            padding: 10px;
            margin-top: 10px;
            font-size: 0.9em;
        }
        .doc-link {
            display: inline-block;
            margin-top: 5px;
            padding: 3px 8px;
            background-color: #409eff;
            color: white;
            text-decoration: none;
            border-radius: 3px;
            font-size: 0.8em;
        }
        .doc-link:hover {
            background-color: #66b1ff;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #909399;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .summary {
                flex-direction: column;
                gap: 15px;
            }
            th, td {
                padding: 8px;
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>前端性能优化检测报告</h1>
        <p>项目路径: <%= projectPath %></p>
    </div>
    
    <div class="summary">
        <div class="summary-item">
            <h2 class="passed"><%= passedCount %></h2>
            <p>通过项</p>
        </div>
        <div class="summary-item">
            <h2 class="warning"><%= warningCount %></h2>
            <p>警告项</p>
        </div>
        <div class="summary-item">
            <h2><%= totalCount %></h2>
            <p>总检测项</p>
        </div>
    </div>
    
    <% categories.forEach(category => { %>
        <div class="category">
            <div class="category-header">
                <h2><%= category.name %></h2>
            </div>
            <div class="items">
                <table>
                    <thead>
                        <tr>
                            <th>优化项</th>
                            <th>责任方</th>
                            <th>核心检测逻辑（工具可实现）</th>
                            <th>检测结果</th>
                            <th>检测结果判定标准</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% category.items.forEach(item => { %>
                            <tr>
                                <td><%= item.item %></td>
                                <td>前端</td>
                                <td><%= item.message %></td>
                                <td class="<%= item.status === 'passed' ? 'status-passed' : 'status-warning' %>">
                                    <%= item.status === 'passed' ? '✅ 通过' : '⚠️ 警告' %>
                                </td>
                                <td>
                                    <% if (item.status === 'passed') { %>
                                        符合标准
                                    <% } else { %>
                                        <%= item.recommendation %>
                                        <% if (item.docPath) { %>
                                            <br><a href="http://localhost:<%= vitepressPort %>/<%= item.docPath %>" class="doc-link" target="_blank">查看详细优化指南</a>
                                        <% } %>
                                    <% } %>
                                </td>
                            </tr>
                        <% }); %>
                    </tbody>
                </table>
            </div>
        </div>
    <% }); %>
    
    <div class="footer">
        <p>报告生成时间: <%= new Date().toLocaleString('zh-CN') %></p>
        <p>@tywd/optimize-cli - 前端性能优化检测工具</p>
        <p><a href="http://localhost:<%= vitepressPort %>" target="_blank">📘 查看完整技术文档</a></p>
    </div>
</body>
</html>`;
    }
    
    // 准备数据
    const passedCount = results.filter(r => r.status === 'passed').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const totalCount = results.length;
    
    // 按类别分组
    const categoryNames = [...new Set(results.map(r => r.category))];
    const categories = categoryNames.map(name => ({
      name,
      items: results.filter(r => r.category === name)
    }));
    
    // 渲染模板
    const html = ejs.render(template, {
      projectPath: this.projectPath,
      passedCount,
      warningCount,
      totalCount,
      categories,
      vitepressPort: this.vitepressPort
    });
    
    // 写入报告文件
    const reportPath = path.join(this.projectPath, 'optimize-report.html');
    await fs.writeFile(reportPath, html);
    
    // 在浏览器中打开报告
    exec(`open ${reportPath}`, (error) => {
      if (error) {
        console.log(`无法自动打开浏览器，请手动打开: ${reportPath}`);
      }
    });
    
    return reportPath;
  }
}

module.exports = { OptimizerDetector };