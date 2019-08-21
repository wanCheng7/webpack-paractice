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

### 文件监听
`webpack`开启监听模式，有两种方式：
- 启动webpack命令时，带上--watch参数
- 在配置webpack.config.js中设置 watch:true

这种方式执行命令之后不会刷新浏览器，所以需要手动刷新才能看到效果

原理是采用的轮询，判断最后修改时间是否发生了变化。轮询选项是可以配置的

### 热更新及原理分析
添加依赖：
```
yarn add webpack webpack-cli webpack-dev-server -D
```

在`webpack.config.js`的配置加加上`webpack`内置插件`HotModuleReplacementPlugin`以及做相关配置：
```
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
```
注意：这里的`HotModuleReplacementPlugin plugins`在`hot`设为`true`的情况下是会被自动引入的。这里只是为了说明原理一起写出来。

在`package.json`中添加执行命令
```
"dev": "webpack-dev-server --open"
```

原理：
>  webpack-dev-server(WDS)的功能提供 bundle server的能力，就是生成的 bundle.js 文件可以通过 localhost://xxx 的方式去访问，另外 WDS 也提供 livereload(浏览器的自动刷新)。

> hot-module-replacement-plugin 的作用是提供 HMR 的 runtime，并且将 runtime 注入到 bundle.js 代码里面去。一旦磁盘里面的文件修改，那么 HMR server 会将有修改的 js module 信息发送给 HMR runtime，然后 HMR runtime 去局部更新页面的代码。因此这种方式可以不用刷新浏览器。

关于浏览器还是会整体刷新的问题：（待探究）

`webpack-dev-server` 默认是会在内容编译完成后自动刷新(liveload)浏览器的，此处增加了 `HotModuleReplacementPlugin` 插件之后可以做到 HMR的。如果HMR失败的化会降级使用 `liveload` 自动刷新浏览器模式。

### 文件指纹策略
> 打包输出的文件名的后缀

常见的文件指纹类型：
- Hash: 和整个项目的构建相关，只要项目文件有修改，整个项构建的hash值就会更改
- Chunkhash：和`webpack`打包的`chunk`有关，不同的`entry`会生成不同的`chunkhash`值
- Contenthash：根据文件内容来定义`hash`，文件内容不变，则`contenthash`不变

一般对于js文件我们使用`chunkhash`，对于css文件使用`contenthash`。对于css文件需要单独分离的话一般使用`MiniCssExtractPlugin`进行分离，设置filename时时使用`contenthash`（js待敌有没有contenthash，值得查一下）
```
// 添加依赖
yarn add mini-css-extract-plugin -D
```

### HTML、CSS、JS代码压缩
**JS文件的压缩**：webpack4之后内置了`uglifyjs-webpack-plugin`可以进行JS压缩

**CSS文件的压缩**：使用`optimize-css-assets-webpack-plugin`，同时使用`cssnano`
```
//安装依赖
yarn add cssnano optimize-css-assets-webpack-plugin -D
```

HTML文件压缩：使用`html-webpack-plugin`:
```
//安装依赖
yarn add html-webpack-plugin -D
```
