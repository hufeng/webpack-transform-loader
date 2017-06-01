# webpack-transform-loader

transform module

## 场景

有时候我们需要动态的加载一些React组件，比如微信h5不需要Header组件
而App需要Header组件，这样给上线的bundle带来一些不确定性。

## 怎么办？

1. babel dead code
[minify-dead-code-elimination](http://babeljs.io/docs/plugins/minify-dead-code-elimination/)


```js
if (IS_APP) {
  var Header = require('header')
}
```

我们需要在webpack的添加IS_APP这个变量的定义
```
plugins: [
  new webpack.DefinePlugin({
    IS_APP: false
  })
]
```

如果IS_APP为false，
```js
if (false) {
  var Header = require('header')
}
```

这个会被babel的deadcode的plugin插件remove掉变成
```
var Header;
```

这样就可以避免Header组件在h5中的加载

但是这样也有问题，
1. 不能使用import，因为import必须top-level

2. 如果被依赖组件是export default 暴露的方式，此处需要变成require('header').default

3. Header是undefined,我们在调用处就变成Header && <Header/>

# React-Native？
在react-native中实际上也存在类似的问题，比如这个组件是android使用，这个组件是iOS使用
那RN是怎么解决的？就是通过模块的后缀名，

index.android.js
index.ios.js

Header.android.js
Header.ios.js

打包根据Platform是(Android|iOS)来动态引入模块

我们可以借鉴这个方式来解决类似的问题

## webpack loader
webpack中有很多的loader，style-loader, file-loader等等可以对源码做transform

我们可以借鉴这个方式来解决。

```js
module.exports = {
  entry: '--entry file--',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader?cacheDirectory'},
      {test: /\.app.js$/, loader: 'webpack-transform-loader?enable=(true|false)'}
    ]
  }
}
```

通过webpack-transform-loader的开启或者关闭，可以动态的替换组件的内容

```
import Header from './header.app.js'
//如果开启，header.app.js会原样返回
//如果关闭，header.app.js的内容会被替换为function() {return null}
```

为什么是function(){return null}?

因为这是stateless react component可以直接使用
<Header/>
