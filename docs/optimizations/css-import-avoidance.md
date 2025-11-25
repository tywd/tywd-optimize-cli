# 避免使用@import引入CSS优化指南

## 问题描述
项目中使用@import语句引入CSS，阻塞CSS解析和页面渲染，影响加载性能。

## 优化建议

### 1. 使用link标签替代@import

#### 不推荐的写法
```css
/* 避免在CSS中使用@import */
@import url('reset.css');
@import url('common.css');
```

#### 推荐的写法
```html
<!-- 在HTML中使用link标签 -->
<link rel="stylesheet" href="reset.css">
<link rel="stylesheet" href="common.css">
```

### 2. CSS文件组织优化

#### 合并CSS文件
```css
/* 将多个CSS文件合并为一个 */
/* reset.css的内容 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* common.css的内容 */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

/* component.css的内容 */
.button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
```

### 3. Webpack配置优化

#### CSS处理配置
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
```

#### 提取CSS文件
```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  }
};
```

### 4. Vite配置优化

#### CSS配置
```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`
      }
    }
  }
};
```

### 5. 实施步骤

1. 查找项目中所有使用@import的CSS文件
2. 将@import语句替换为link标签
3. 合并相关的CSS文件
4. 配置构建工具优化CSS处理
5. 验证优化效果

### 6. 注意事项

- 确保CSS加载顺序正确
- 避免重复引入相同样式
- 考虑CSS文件的缓存策略
- 测试不同浏览器兼容性

### 7. 验证方法

1. 使用Chrome开发者工具Network面板
2. 检查CSS文件的加载方式
3. 对比优化前后的CSS解析时间
4. 验证样式渲染正确性

通过避免使用@import引入CSS，可以有效减少CSS解析阻塞，提升页面渲染性能。