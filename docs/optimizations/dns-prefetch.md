# DNS预解析配置优化指南

## 问题描述
未在HTML的`<head>`标签中配置DNS预解析，导致浏览器在请求外部资源时需要额外的DNS解析时间。

## 优化建议

### 1. 添加DNS预解析标签
在HTML文件的`<head>`部分添加以下标签：

```html
<!-- 预解析CDN域名 -->
<link rel="dns-prefetch" href="//cdn.example.com">
<!-- 预解析API域名 -->
<link rel="dns-prefetch" href="//api.example.com">
<!-- 预解析图片域名 -->
<link rel="dns-prefetch" href="//img.example.com">
```

### 2. 确定需要预解析的域名
通常需要预解析的域名包括：
- 静态资源域名（CDN）
- API接口域名
- 第三方服务域名（统计、广告等）

### 3. 注意事项
- 不要预解析过多域名，建议控制在3-5个以内
- 仅对跨域资源进行预解析
- 避免预解析当前页面域名（同域资源）

### 4. 实施示例
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>示例页面</title>
  <!-- DNS预解析 -->
  <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="//api.example.com">
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

### 5. 验证方法
1. 打开Chrome开发者工具
2. 进入Network面板
3. 刷新页面
4. 查看DNS解析时间是否减少

通过以上优化，可以有效减少DNS解析时间，提升页面加载速度。