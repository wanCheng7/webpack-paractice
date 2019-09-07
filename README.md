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
// 配置
new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src/index.html'),
  filename: 'index.html',
  chunks: ['index'],
  inject: true,
  minify: {
      html5: true,
      collapseWhitespace: true,
      preserveLineBreaks: false,
      minifyCSS: true,
      minifyJS: true,
      removeComments: false
  }
}),
```

### 自动清理构建目录产物
使用`clean-webpack-plugin`默认会删除output指定的输出目录
```
//安装依赖
yarn add clean-webpack-plugin -D
// 插件中使用
new CleanWebpackPlugin(),
```

### PostCSS插件autoprefixer
利用`autoprefixer`实现浏览器兼容前缀补齐
```
//安装依赖
yarn add postcss-loader autoprefixer -D
//添加loder配置
{
    loader: 'postcss-loader',
    options: {
      plugins: () => [
          require('autoprefixer')({
            overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
          })
      ]
    }
}
```

### 移动端css px自动转换成rem
核心是利用`px2rem-loader`这个loader实现
```
//安装依赖
yarn add px2rem-loader -D
//动态计算rem值
yarn add lib-flexible -S  
```
添加`px2rem-loader`配置
```
{
    loader: 'px2rem-loader',
    options: {
      remUnit: 75,  //表示1rem等于75px
      remPrecision: 8  //小数点位数
    }
}
```
实际项目中如果不考虑超低版本安卓兼容性的话可以直接将HTML的`font-size`设为`vw`值，以750设计稿为例，如果我们想让HTML的``font-size`表示`100px`，经换算（100/750*100）约等于13.33333333vw，这个时候直接将`remUnit`设为100就好了。

### 静态资源内联
可以使用`raw-loader`实现js、html内联
```
//安装依赖
yarn add raw-loader@0.5.1 -D
```
模拟在`<head>`中动态插入一些`<meta>`和js
```
${ require('raw-loader!./meta.html') }
  <title>index</title>
  <script>
    ${ require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js') }
  </script>
```

### 多页面应用打包方案
利用`Glob`解析约定目录里的所有文件作为入口文件
```
//安装依赖
yarn add Glob -D
```
约定每个页面的模板文件为`index.html`，入口文件为`index.js`，然后就可以得到一个动态的入口配置和`htmpWebpackPlugins`配置：
```
// 设置多页面应用的入口和HTML魔板配置
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  entryFiles.forEach((item ,idx) => {
     const match = item.match(/src\/(.*)\/index.js/);
     const pageName = match && match[1];
     entry[pageName] = item;
     htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
        }
      })
     )
  })

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();
```
然后在配置中替换之前的`entry`和写死的`htmlWebpackPlugins`:
```
// entry: {
//   index: './src/index.js',
//   search: './src/search.js'
// },
entry,

plugins: [
    //之前的别的plugins
    //动态页面的模板文件
    ...htmlWebpackPlugins
]
```




