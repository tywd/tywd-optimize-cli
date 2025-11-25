# 静态资源加文件指纹优化指南

## 问题描述
项目中的静态资源文件未添加文件指纹，影响浏览器缓存策略和资源更新管理。

## 优化建议

### 1. Webpack文件指纹配置

#### 配置output.filename
```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    assetModuleFilename: '[name].[contenthash:8][ext]'
  }
};
```

#### 配置CSS文件指纹
```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    })
  ]
};
```

### 2. Vite文件指纹配置

#### 配置build.rollupOptions
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
};
```

#### 配置assetsDir和filename
```javascript
// vite.config.js
export default {
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  }
};
```

### 3. 缓存策略配置

#### HTML文件缓存
```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      hash: true // 为HTML文件添加hash
    })
  ]
};
```

#### 服务器缓存头设置
```nginx
# nginx配置示例
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.html$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 4. 实施步骤

1. 配置构建工具的文件命名规则
2. 启用contenthash或hash指纹
3. 配置服务器缓存策略
4. 验证文件指纹生成

### 5. 注意事项

- 区分contenthash、hash和chunkhash的使用场景
- 确保HTML文件不被长期缓存
- 考虑文件指纹对SEO的影响

### 6. 验证方法

1. 构建项目后检查文件名
2. 确认文件名包含hash值
3. 验证缓存策略生效

通过为静态资源添加文件指纹，可以实现更精准的缓存控制，提升用户体验。