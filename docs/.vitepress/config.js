import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/tywd-optimize-cli/',
  title: '前端性能优化检测工具',
  description: '基于优化清单的自动化检测工具',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/usage' },
      { text: '优化项详解', link: '/optimizations/dns-prefetch' },
      { text: '开发文档', link: '/development/implementation' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '安装与使用', link: '/guide/usage' },
            { text: '命令行参数', link: '/guide/commands' }
          ]
        }
      ],
      '/optimizations/': [
        {
          text: 'DNS解析阶段',
          items: [
            { text: 'DNS预解析配置', link: '/optimizations/dns-prefetch' },
            { text: '合并域名数量', link: '/optimizations/domain-consolidation' }
          ]
        },
        {
          text: 'HTTP请求阶段',
          items: [
            { text: '合并JS/CSS小文件', link: '/optimizations/small-file-merge' },
            { text: '移除未使用资源', link: '/optimizations/remove-unused-resources' },
            { text: '图片格式优化与压缩', link: '/optimizations/image-optimization' },
            { text: '代码压缩混淆', link: '/optimizations/code-minification' },
            { text: '静态资源加文件指纹', link: '/optimizations/file-fingerprint' },
            { text: '非首屏CSS延迟加载', link: '/optimizations/css-deferred-loading' },
            { text: 'JS使用defer/async', link: '/optimizations/js-defer-async' },
            { text: '图片懒加载', link: '/optimizations/image-lazy-loading' }
          ]
        },
        {
          text: '解析与渲染阶段',
          items: [
            { text: 'JS脚本位置优化', link: '/optimizations/js-script-position' },
            { text: 'JS代码分割与动态加载', link: '/optimizations/js-code-splitting' },
            { text: '避免使用@import引入CSS', link: '/optimizations/css-import-avoidance' },
            { text: '简化CSS选择器', link: '/optimizations/css-selector-simplification' },
            { text: 'CSS动画替代JS动画', link: '/optimizations/css-animation-substitution' }
          ]
        },
        {
          text: '交互就绪阶段',
          items: [
            { text: '拆分JS长任务', link: '/optimizations/js-long-task-splitting' },
            { text: '避免同步阻塞API', link: '/optimizations/avoid-blocking-api' },
            { text: '第三方脚本优化加载', link: '/optimizations/third-party-script-optimization' },
            { text: '预加载关键资源', link: '/optimizations/resource-preloading' }
          ]
        },
        {
          text: '工程化落地阶段',
          items: [
            { text: '构建工具基础配置', link: '/optimizations/build-tool-configuration' },
            { text: '包体积异常检测', link: '/optimizations/bundle-size-optimization' }
          ]
        }
      ],
      '/development/': [
        {
          text: '开发文档',
          items: [
            { text: '实现过程', link: '/development/implementation' },
            { text: '架构设计', link: '/development/architecture' },
            { text: '迭代展望', link: '/development/roadmap' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tywd/optimize-cli' }
    ]
  }
})