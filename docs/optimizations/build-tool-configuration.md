# 构建工具基础配置优化指南

## 问题描述
项目中未正确配置构建工具的基础优化选项，影响代码压缩、Tree Shaking等优化功能。

## 优化建议

### 1. Webpack基础配置

#### 生产环境配置
```javascript
// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true // 构建前清理输出目录
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: true,
          format: {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    // 启用Tree Shaking
    sideEffects: false
  }
};
```

### 2. Vite基础配置

#### 生产环境配置
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: '[ext]/[name].[hash].[ext]'
      }
    },
    // 启用CSS压缩
    cssMinify: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
```

### 3. Tree Shaking配置

#### package.json配置
```json
{
  "name": "my-project",
  "sideEffects": false,
  "scripts": {
    "build": "webpack --mode=production"
  }
}
```

#### 模块导出优化
```javascript
// utils.js - 使用具名导出而非默认导出
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 避免这种写法
// export default {
//   add,
//   subtract
// };
```

### 4. 代码分割配置

#### Webpack动态导入
```javascript
// 使用动态导入实现代码分割
async function loadModule() {
  const { default: module } = await import(
    /* webpackChunkName: "heavy-module" */ 
    './heavy-module.js'
  );
  return module;
}

// 路由级别的代码分割
const routes = [
  {
    path: '/about',
    component: () => import(
      /* webpackChunkName: "about" */ 
      './views/About.vue'
    )
  }
];
```

### 5. 资源优化配置

#### 图片优化
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB以下转为base64
          }
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        }
      }
    ]
  }
};
```

#### 字体优化
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]'
        }
      }
    ]
  }
};
```

### 6. 环境变量配置

#### .env文件
```env
# .env.production
NODE_ENV=production
VITE_APP_API_URL=https://api.production.com
VITE_APP_DEBUG=false
```

#### 代码中使用环境变量
```javascript
// 在代码中使用环境变量
const apiUrl = import.meta.env.VITE_APP_API_URL;
const isDebug = import.meta.env.VITE_APP_DEBUG === 'true';
```

### 7. 实施步骤

1. 配置构建工具的生产环境选项
2. 启用代码压缩和混淆
3. 配置Tree Shaking和sideEffects
4. 实现代码分割和动态导入
5. 优化资源处理配置
6. 配置环境变量
7. 验证构建结果

### 8. 注意事项

- 确保生产环境配置不会影响开发体验
- 测试构建后的代码功能完整性
- 考虑构建时间和资源大小的平衡
- 处理不同环境的配置差异

### 9. 验证方法

1. 检查构建产物的文件大小
2. 验证Tree Shaking是否生效
3. 对比优化前后的构建时间
4. 测试生产环境功能完整性

通过正确配置构建工具基础选项，可以有效提升代码质量和加载性能。