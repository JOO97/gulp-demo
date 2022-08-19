> 2022/08/19 Created By 张嘉敏



# Gulp

## 1 Intro

### 1.1 什么是Gulp

> A toolkit to automate & enhance your workflow

> 是一个**前端自动化构建工具**。对于需要反复重复的任务，例如代码转换、代码检测、图片压缩等，在gulp中定义一系列的任务，就可以将这些过程自动化，以提高我们的工作流

![image-20220818151854185](https://s2.loli.net/2022/08/18/xejBylfJczMKs8i.png)



**核心 task runner**

- 可以定义一系列的**任务**
- 基于**文件Stream**的构建流
- 对大量源文件可以进行流式处理，利用gulp的**插件**体系可以对文件类型进行多种操作处理

**缺点**

默认不支持模块化，更适合用于编写一些自动化的任务

> **webpack**是一个模块化的打包工具，可以使用各种loader来加载不同的模块。



### 1.2 基本使用

**安装**

````shell
npm install --global gulp-cli
````

````shell
npm install --save-dev gulp
````

![image-20220805111024477](https://s2.loli.net/2022/08/19/KkBCrPXmYEiLnF8.png)

**创建gulpfile**

````javascript
//在gulpfile.js中创建一个默认任务
exports.default = cb => {
  cb()
}
````

**运行结果**

````sh
gulp
````

![01](https://s2.loli.net/2022/08/19/w1AmTWNuj63UHe5.png)



## 2 Basic

### 2.1 CLI

命令 `gulp [flags] <task> <task> ...`

说明

1. `gulp` 执行当前目录下gulpfile.js中的默认任务
2. `gulp 任务名称` 执行指定任务, 若要执行多个任务，任务间以空格分割
3. flags

   - `-f`  指定gulpfile目录

   - `-T`  打印当前所有任务依赖树

   - `--tasks-simple` 打印当前所有任务

   - [文档参考](https://github.com/gulpjs/gulp-cli/blob/master/docs/CLI.md)



### 2.2 Gulpfile

gulpfile 是项目目录下名为 `gulpfile.js` （或者首字母大写 `Gulpfile.js`）的文件，在运行 `gulp` 命令时会被自动加载。所有导出的函数都将注册到 gulp 的任务（task）系统中。

默认使用`commonjs`规范来编写gulpfile 文件。

**ES Moudle**

使用es module规范来编写gulpfile，需安装`esm`并把gulpfile文件命名为`gulpfi.esm.js'`

**Gulpfile 转译**

可以使用需要转译的编程语言来书写 gulpfile 文件，例如 TypeScript 或 Babel

- 对于 TypeScript，重命名为 `gulpfile.ts` 并安装 [ts-node](https://www.npmjs.com/package/ts-node) 模块

https://github.com/kdcllc/ionic-typescript-seed/blob/master/gulpfile.ts

````javascript
 import tool from './utils/index'
 
 const tsTask = (cb): void => {
   console.log('run gulpfile.ts')
   tool()
   cb()
 }
 exports.default = tsTask
````

- 对于 Babel，重命名为 `gulpfile.babel.js` 并安装 [@babel/register](https://www.npmjs.com/package/@babel/register)   [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) 模块

https://github.com/olehreznichenko/gulpfile.babel.js/tree/master/gulp/tasks

`gulpfile.babel.js`

````javascript
import { clean } from './utils/clean.js'

const babelTask = cb => {
  console.log('run gulpfile.babel.js')
  cb()
}

export default babelTask
export { clean }
````

`.babelrc.json`

````json
{
  "presets": ["@babel/preset-env"]
}
````

**Gulpfile 分割**

一般是将所有业务逻辑都写到一个 gulpfile 文件中，随着文件的变大，可以将此文件重构为数个独立的文件。

每个任务（task）可以被分割为独立的文件，然后导入（import）到 gulpfile 文件中并组合

Node 的模块解析功能允许你将 `gulpfile.js`文件替换为同样命名为 `gulpfile.js` 的目录，该目录中包含了一个名为 `index.js` 的文件，该文件被当作 `gulpfile.js` 使用

````
├─gulpfile.js
|      └index.js
````



## 3 Concepts

### 3.1 Task

**gulp中的任务**

- 每个gulp任务都是一个异步的JavaScript函数, 不支持同步任务

- 可以是接受一个callback作为参数的函数，调用callback函数即任务结束

- 或者是一个返回stream、promise、event emitter、child process或observable类型的函数

**创建方式**

````javascript
//方法一 gulp4
const task1 = cb => {
  cb()
}
//exports.[任务名称]
exports.task = task1

//方法二 gulp4之前注册任务的方法
const task2 = cb => {
  cb()
}
task(task2)

//方法三 gulp4之前注册任务的方法
task('task3', cb => {
  cb()
})
````

**任务函数类型**

1. 以回调函数作为参数

   ````javascript
   const callbackFn = (cb)=>{
     cb() //调用cb结束当前任务
   }
   const callbackFn2 = (cb)=>{
     cb('ERROR') //若传入参数则表示该任务执行失败，该参数会作为错误信息被打印
   }
   ````

2. 返回值为stream（常用）

3. 返回值为promise、event emitter、child process或observable类型 

**公开/私有任务**

- 公开任务（Public tasks） 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用
- 私有任务（Private tasks） 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分



### 3.2 Vinyl File Object 

Gulp是基于**流**的构建工具。Gulp使用的是**Stream**，但却不是普通的Node Stream

> **Stream** 是node的内置模块，主要有**Readable**（只读流）、**Writable**（只写流）、**Duplex**（双向流）、**Transform**（转换）四种流类型。Stream主要提供一个pipe()方法，该方法接收一个转换流或可写流， 且返回目标流。因此可以链式调用 `a.pipe(b).pipe(c).pipe(d)` 

实际上，Gulp（以及Gulp插件）用的应该叫做Vinyl File Object Stream。**Vinyl**是一个文件的描述对象，**Vinyl主要用两个属性来描述文件，它们分别是路径（path）及内容（contents）**。是文件的抽象表现，可以用之表述为任何形式的文件对象，如操作系统文件、网络文件等等。

**Vinyl基本使用**

````javascript
const Vinyl = require('vinyl') //引入vinyl
const jsFile = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/test.js',
  contents: Buffer.from('test Vinyl'),
})
````

**Vinyl的意义**

Gulp为什么不使用普通的Node Stream呢？请看这段代码：

```javascript
gulp.task("css", function(){
    gulp.src("./src/**/*.css")
        .pipe(gulp.dest("./dest"));
});
```

这段代码是将一个目录下的`.css`文件，都复制到了另一个目录。这其中还有一个很重要的特性，那就是所有原目录下的文件树，包含子目录、文件名等，都原封不动地保留了下来。普通的Node Stream只传输String或Buffer类型，也就是只关注“内容”。但Gulp不只用到了文件的内容，而且还用到了这个文件的相关信息

**类型**

Vinyl File Object的**contents可以有三种类型**：**Stream**、**Buffer**（二进制数据）、**Null**（就是JavaScript里的`null`）。需要注意的是，**各类Gulp插件虽然操作的都是Vinyl File Object，但可能会要求不同的类型**。

在使用Gulp过程中，可能会碰到incompatible streams的问题，像这样：

![incompatible streams](https://s2.loli.net/2022/08/19/5aLWwdinfDmr3Xs.png)

这个问题的原因一般都是Stream与Buffer的类型差异。Stream特性是可以把数据分成小块，一段一段地传输，而Buffer则是整个文件作为一个整体传输。可以想到，不同的Gulp插件做的事情不同，因此可能不支持某一种类型。例如，`gulp-uglify`这种需要对JavaScript代码做语法分析的，就必须保证代码的完整性，因此，`gulp-uglify`只支持Buffer类型的Vinyl File Object。

`gulp.src()`方法默认会返回Buffer类型，如果想要Stream类型，可以这样指明：

```arduino
gulp.src("*.js", {buffer: false})
```

**vinyl-fs**

Gulp并没有直接使用vinyl，而是用了一个叫做`vinyl-fs`的模块。[vinyl-fs](https://link.segmentfault.com/?enc=jQaobCWsrj5Nncny4WkFRQ%3D%3D.yCv5wWR%2F2zMZJwODTWvYmjUe1u77K04sfmvA0eKI1kGG8kI7esC7lcUY8WpzCtRP)相当于vinyl的文件系统适配器，它提供三个方法：`.src()`、`.dest()`和`.watch()`，其中`.src()`将生成Vinyl File Object，而`.dest()`将使用Vinyl File Object，进行写入操作。

在Gulp源码`index.js`中，可以看到这样的对应关系：

```javascript
var vfs = require('vinyl-fs');
// ...
Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
// ...
```

也就是说，`gulp.src()`和`gulp.dest()`直接来源于vinyl-fs



### 3.3 Glob

glob 是由普通字符和/或通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件

**匹配规则**

1.  `*` ，在一个字符串中，匹配任意数量的字符，包括0个匹配

2. `**`，在多个字符串匹配中匹配任意数量的字符串，通常用在匹配目录下的文件
3. `!`，反取，glob 数组中的取反必须跟在一个非取反的后面

```javascript
gulp.src('./js/*.js')                           // * 匹配js文件夹下所有.js格式的文件
gulp.src('./js/**/*.js')                        // ** 匹配js文件夹的0个或多个子文件夹
gulp.src(['./js/*.js','!./js/index.js'])        // ! 匹配除了index.js之外的所有js文件
```

[参考资料]: https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/



## 4 API

### 4.1 src()

> src方法根据所传入的globs，从文件系统匹配到对应文件并读取，然后生成一个Stream，它将所有匹配的文件读取到内 
>
> 存中并通过流（Stream）进行处理； 

**定义**

`src(globs, [options])` 

**参数说明** [#](https://gulpjs.com/docs/en/api/src#parameters)

1.`globs`

类型：string array

说明:  文件路径或使用 [node-glob](https://github.com/isaacs/node-glob)  语法来匹配文件

2.`options`

类型：object

说明: 

- allowEmpty:  当 `globs` 参数匹配一个指定文件时(如 `src/empty.js`) 而且没有找到匹配或匹配到的文件内容为空，会抛出一个错误，提示 "File not found with singular glob"，此时需要将 `allowEmpty` 选项设置为 `true`
- read：当不需要读取匹配到的文件时，可将`read`设置为`true`
- 其余参数请参考 https://gulpjs.com/docs/en/api/src#options

**示例**

````javascript
const { src, dest } = require('gulp')

const copy = ()=>{
  return src('src/js/*.js')
    .pipe(dest('build/'))
}
exports.copy = copy
````



### 4.2 dest()

> 接受一个输出目录作为参数，并且它还会产生一个 Node流(stream)，通过该流将内容输出到文件中

**定义**

`dest(directory, [options])`

**参数说明** [#](https://gulpjs.com/docs/en/api/dest#parameters)

1.`directory`

类型：string function

说明：输出目录的路径

2.`options`

类型：object

说明: 

- overwrite
- append
- sourcemaps
- 其余参数请参考 https://www.gulpjs.com.cn/docs/api/dest/#%E9%80%89%E9%A1%B9

### 4.3 task()

> 用于注册、查询gulp任务

`task([taskName], taskFunction)`

**参数说明** [#](https://www.gulpjs.com.cn/docs/api/task/#parameters)

1.`taskName` 

类型：string 

说明: 任务名称。当taskFunction为匿名函数或任务的displayName为空时，需传入`taskName`，否则为非必填参数。

2.`taskFunction`

类型：function

说明：任务函数。为一个任务函数或组合任务函数（由`series()`、`parallel()`包裹的）

**任务元数据**

|  property   |  type  | note                                                         |
| :---------: | :----: | ------------------------------------------------------------ |
|    name     | string | 函数名称。不可写                                             |
| displayName | string | 任务别名。定义后会覆盖任务原有的名称                         |
| description | string | 任务描述信息                                                 |
|    flags    | object | When attached to a `taskFunction` provides flags to be printed by the command line when listing tasks. The keys of the object represent the flags and the values are their descriptions. |

### 4.4 series()

> 串行任务组合，如果一个任务中发生错误，则不会运行后续任务

**定义**

`series(...tasks)` 

**参数说明** [#](https://www.gulpjs.com.cn/docs/api/series/#%E5%8F%82%E6%95%B0)

1.`tasks`

类型：string function

说明：任意数量的任务函数都可以作为单独的参数传递

### 4.5 parallel()

> 所有任务将按最大并发性运行

**定义**

`parallel(...tasks)` 

**参数说明** [#](https://www.gulpjs.com.cn/docs/api/series/#%E5%8F%82%E6%95%B0)

1.`tasks`

类型：string function

说明：任意数量的任务函数都可以作为单独的参数传递，当运行组合操作时，每个任务将在每次提供时执行。

在两个不同的组合中引用的 `clean` 任务将运行两次，将导致不期望的结果。因此，建议在最终组合中指定 `clean` 任务。

错误示例

```js
const { series, parallel } = require('gulp')

const clean = function(cb) {cb()}

const css = series(clean, function(cb) {cb()})

const javascript = series(clean, function(cb) {cb()})

exports.build = parallel(css, javascript)
```

可转换为：

```js
const { series, parallel } = require('gulp')

function clean(cb) {cb()}

function css(cb) {cb()}

function javascript(cb) {cb()}

exports.build = series(clean, parallel(css, javascript))
```


### 4.6 watch()

> 用于监听文件改变、新增、删除

**定义**

`watch(globs, [options], [task])` 

**参数说明** [#](https://www.gulpjs.com.cn/docs/api/watch/#%E5%8F%82%E6%95%B0)

**返回值**

返回一个**chokidar **实例，用于对监听设置进行细粒度控制。

**示例**

````javascript
exports.default = () => {
  return watch(['src/**/*'], function (cb) {
    console.log(`run watch task`)
    cb()
  })
}
````

**Chokidar实例** [#](https://www.gulpjs.com.cn/docs/api/watch/#chokidar-%E5%AE%9E%E4%BE%8B)

`watch()` 方法返回 [chokidar](https://github.com/paulmillr/chokidar) 的底层实例，提供对监听设置的细粒度控制。最常用来注册提供更改文件的 `path` 或 `stats` 的单个事件处理程序

````javascript
const { watch } = require('gulp')

const watcher = watch(['src/**/*'])

watcher.on('change', function (path, stats) {
  console.log(`File ${path} was changed`)
  watcher.close()
})

watcher.on('add', function (path, stats) {
  console.log(`File ${path} was added`)
})

watcher.on('unlink', function (path, stats) {
  console.log(`File ${path} was removed`)
})

````



## 5 Plugin

> Gulp的每个插件只完成一个功能，这也是Unix的设计原则之一，各个功能通过流进行整合并完成复杂的任务。
>
> 官方插件库 https://gulpjs.com/plugins

### 5.1 常用Gulp 插件

#### gulp-babel

> es6+转es5

#### gulp-imagemin 

> 压缩图片

#### gulp-less

> 将less文件转为css

#### gulp-htmlmin 

> html压缩

#### gulp-terser 

> 混淆js文件

#### gulp-sourcemaps

> 生成sourcemap

#### gulp-inject

> html资源注入



### 5.2 常用node库

#### browser-sync

> 是浏览器同步测试工具，能让浏览器实时、快速响应文件更改（html、js、css、sass、less等）并自动刷新页面
>
> https://browsersync.io/

**安装** `npm i browser-sync -D`

**与gulp结合使用**

````javascript
const bs = browserSync.create()
const serve = () => {
  bs.init({
    port: 8080,
    open: true,
    files: './dist/*',
    server: {
      baseDir: './dist',
    },
  })
}
````

**代理模式**

localhost:8081为本地已有的web服务地址

````sh
browser-sync start --proxy "localhost:8081" "*"
````

#### yargs 

> 处理[命令行](https://so.csdn.net/so/search?q=命令行&spm=1001.2101.3001.7020)参数。https://yargs.js.org/

#### del

> 删除指定目录下所有文件。https://github.com/sindresorhus/del



## 6 Demo

````javascript
const { src, dest, watch, series, parallel } = require('gulp')

const htmlMin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const less = require('gulp-less') // less
const postcss = require('gulp-postcss') // postcss
const postcssPresetEnv = require('postcss-preset-env')
const inject = require('gulp-inject')

const sourceMap = require('gulp-sourcemaps')

const browserSync = require('browser-sync')
const webpack = require('webpack-stream')

const del = require('del')

const htmlTask = () => {
  return src('./src/*.html', { base: './src' })
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('./dist'))
}

const jsTask = () => {
  return src('./src/js/**.js', { base: './src' })
    .pipe(sourceMap.init())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(
      webpack({
        output: {
          filename: './js/[name].js',
        },
      })
    )
    .pipe(terser({ mangle: { toplevel: true } }))
    .pipe(sourceMap.write('./'))
    .pipe(dest('./dist'))
}

const lessTask = () => {
  return src('./src/css/*.less', { base: './src' })
    .pipe(less())
    .pipe(postcss([postcssPresetEnv()]))
    .pipe(dest('./dist'))
}

const injectHtml = () => {
  return src('./dist/*.html')
    .pipe(
      inject(src(['./dist/js/*.js', './dist/css/*.css']), { relative: true })
    )
    .pipe(dest('./dist'))
}

// 搭建本地服务器
const bs = browserSync.create()
const serve = () => {
  watch('./src/*.html', series(htmlTask, injectHtml))
  watch('./src/js/*.js', series(jsTask, injectHtml))
  watch('./src/css/*.less', series(lessTask, injectHtml))

  bs.init({
    port: 8085,
    open: true,
    files: './dist/*',
    server: {
      baseDir: './dist',
    },
  })
}

const clean = () => {
  return del(['dist'])
}

//构建任务
const buildTask = series(
  clean, //清理目录
  parallel(htmlTask, jsTask, lessTask), //分别处理html、js、less文件
  injectHtml //将处理后的文件地址注入到html
)
//本地服务
const serveTask = series(buildTask, serve)

module.exports = {
  serveTask,
  buildTask,
}
````



## 7 相关链接

- 官方文档 https://gulpjs.com/
- 中文文档 https://www.gulpjs.com.cn/
- Gulp插件库 https://gulpjs.com/plugins
- Gulp技巧集合 https://v3.gulpjs.com.cn/docs/recipes/
- Gulp学习资料集合 https://github.com/Platform-CUF/use-gulp
- Gulp4 工作流配置示例 https://github.com/zhonglimh/Ublue-gulp-config
