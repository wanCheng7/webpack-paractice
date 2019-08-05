# 玩转webpack学习笔记

### Loaders
`webpack`开箱即用只支持`JS`和`JSON`两种文件类型，通过`loaders`去支持其他文件类型并且把它们转化成有效的模块，并且可以添加到依赖中。
> loaders本身十个函数，接受源文件作为参数，返回转换的结果

### Plugins
> 插件用于bundle文件的优化，资源管理和环境变量的注入，作用于整个构建过程

### 解析ES6和JSX
需要引入`babel-loader`和配置`.babelrc`
```
//安装依赖
yarn add @babel/core @babel/preset-env @babel/preset-react babel-loader D
```
```
//.babelrc中配置presets，上面是解析es6，下面是解析jsx
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

### 解析CSS、Less和Sass
- 解析CSS
```
//安装依赖
yarn add style-loader css-loader -D
//添加loader
{
    test: /.less$/,
    use: [
      'style-loader',
      'css-loader',
      'less-loader'
    ]
}
```
- 解析Less
```
//添加依赖
yarn add less less-loader -D
//添加loader
{
    test: /.less$/,
    use: [
      'style-loader',
      'css-loader',
      'less-loader'
    ]
}
```

### 解析图片和字体
可以用`file-loader`，也可以直接用`url-loader`，因为`url-loader`也是基于`file-loader`的，并且可以配置较小文件自动转为base64编码
```
//添加依赖
yarn add url-loader -D
//webpack配置
{
    test: /.(png|jpg|jpeg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10240  //b
        }
      }
    ]
}
```

