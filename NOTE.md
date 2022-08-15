

Gulp

## 1 Intro

### 1.1 前端工程化

https://gulpjs.com/

### 1.2 Node Stream

pipe

pipeline

event

https://www.lmlphp.com/user/16675/article/item/575940/

### 1.3 



## 2 Basic

### 2.1 Quick Start

**SetUp**

````shell
npm install --global gulp-cli
````

````shell
npm install --save-dev gulp
````

![image-20220805111024477](C:\Users\LEGION\AppData\Roaming\Typora\typora-user-images\image-20220805111024477.png)

**Create a gulpfile**

````javascript
//在gulpfile.js中创建一个默认任务
exports.default = cb => {
  cb()
}
````

**Run Task**

````sh
gulp
````

**Result**

![01](C:/Users/LEGION/Desktop/TEMP/gulp/01.png)

### 2.2 CLI

命令 `gulp [flags] <task> <task> ...`

说明

1. `gulp` 执行当前目录下gulpfile.js中的默认任务
2. `gulp 任务名称` 执行指定任务, 若要执行多个任务，任务间以空格分割
3. flags

   - `-f`  指定gulpfile目录

   - `-T`  打印当前所有任务依赖树

   - `--tasks-simple` 打印当前所有任务

   - [文档参考](https://github.com/gulpjs/gulp-cli/blob/master/docs/CLI.md)



### 2.3 Gulpfile

gulpfile 是项目目录下名为 `gulpfile.js` （或者首字母大写 `Gulpfile.js`）的文件，在运行 `gulp` 命令时会被自动加载。所有导出的函数都将注册到 gulp 的任务（task）系统中。

默认使用`commonjs`规范来编写gulpfile 文件。

**gulpfile.esm.js**

使用es module规范来编写gulpfile，需安装`esm`并把gulpfile命名为`c'`





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

大部分用户起初是将所有业务逻辑都写到一个 gulpfile 文件中。随着文件的变大，可以将此文件重构为数个独立的文件。

每个任务（task）可以被分割为独立的文件，然后导入（import）到 gulpfile 文件中并组合。这不仅使事情变得井然有序，而且可以对每个任务（task）进行单独测试，或者根据条件改变组合。

Node 的模块解析功能允许你将 `gulpfile.js`文件替换为同样命名为 `gulpfile.js` 的目录，该目录中包含了一个名为 `index.js` 的文件，该文件被当作 `gulpfile.js` 使用。且该目录中还可以包含各个独立的任务（task）模块。

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
//方法一
const task1 = cb => {
  cb()
}
//exports.[任务名称]
exports.task = task1

//方法二 不推荐
const task2 = cb => {
  cb()
}
task(task2)

//方法三 不推荐
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

2. 返回值为stream、promise、event emitter、child process或observable类型 *TODO





**公开/私有任务**

- 公开任务（Public tasks） 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用
- 私有任务（Private tasks） 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分





http://acgtofe.com/posts/2015/09/dive-into-gulp-stream

### 3.2 Vinyl File Object

**Vinyl**可以看做一个文件描述器，通过它可以轻松构建单个文件的元数据（metadata object）描述对象

对

**基本使用**

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
    gulp.src("./stylesheets/src/**/*.css")
        .pipe(gulp.dest("./stylesheets/dest"));
});
```

虽然这段代码没有用到任何Gulp插件，但包含了我们最为熟悉的`gulp.src()`和`gulp.dest()`。这段代码是有效果的，就是将一个目录下的全部`.css`文件，都复制到了另一个目录。这其中还有一个很重要的特性，那就是所有原目录下的文件树，包含子目录、文件名等，都原封不动地保留了下来。

普通的Node Stream只传输String或Buffer类型，也就是只关注“内容”。但Gulp不只用到了文件的内容，而且还用到了这个文件的相关信息（比如路径）



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



**类型**

Vinyl File Object的**contents可以有三种类型**：**Stream**、**Buffer**（二进制数据）、**Null**（就是JavaScript里的`null`）。需要注意的是，**各类Gulp插件虽然操作的都是Vinyl File Object，但可能会要求不同的类型**。

在使用Gulp过程中，可能会碰到incompatible streams的问题，像这样：

![incompatible streams](https://segmentfault.com/img/bVpYZT)

这个问题的原因一般都是Stream与Buffer的类型差异。Stream如前文介绍，特性是可以把数据分成小块，一段一段地传输，而Buffer则是整个文件作为一个整体传输。可以想到，不同的Gulp插件做的事情不同，因此可能不支持某一种类型。例如，`gulp-uglify`这种需要对JavaScript代码做语法分析的，就必须保证代码的完整性，因此，`gulp-uglify`只支持Buffer类型的Vinyl File Object。

`gulp.src()`方法默认会返回Buffer类型，如果想要Stream类型，可以这样指明：

```arduino
gulp.src("*.js", {buffer: false})
```



### 3.3 Glob

glob 是由普通字符和/或通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件

1、* ，对于匹配单级目录下的文件很有用。
2、* * ，对于匹配嵌套目录下的文件很有用。
3、! 反取，glob 数组中的取反必须跟在一个非取反的后面

```javascript
gulp.src('./js/*.js')                           // * 匹配js文件夹下所有.js格式的文件
gulp.src('./js/**/*.js')                        // ** 匹配js文件夹的0个或多个子文件夹
gulp.src(['./js/*.js','!./js/index.js'])        // ! 匹配除了index.js之外的所有js文件
gulp.src('./js/**/{omui,common}.js')            // {} 匹配{}里的文件名
```

[参考资料]: https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/













## 4 API

### 4.1 src()

**定义**

`src(globs, [options])` 

**参数说明** [#](https://gulpjs.com/docs/en/api/src#parameters)

1.`globs`

类型：string array

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

### 4.3 symlink()

软链接

fs.symlink https://nodejs.org/api/fs.html#fssymlinktarget-path-type-callback

https://baijiahao.baidu.com/s?id=1711929846570027467&wfr=spider&for=pc

### 4.4 task()

**提示**: 官方不再推荐使用该API

`task([taskName], taskFunction)`

可用于注册、查询任务

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





### 4.5 series()

**定义**

`series(...tasks)` 

所有任务将按顺序运行。如果一个任务中发生错误，则不会运行后续任务



**参数说明** [#](https://www.gulpjs.com.cn/docs/api/series/#%E5%8F%82%E6%95%B0)

1.`tasks`

类型：string function

说明：任意数量的任务函数都可以作为单独的参数传递。如果您以前注册过任务，可以使用字符串，但不建议这样做





### 4.6 parallel()

**定义**

`parallel(...tasks)` 

所有任务将按最大并发性运行。如果一个任务发生错误，其他任务可能不确定地完成，也可能不完成。



**参数说明** [#](https://www.gulpjs.com.cn/docs/api/series/#%E5%8F%82%E6%95%B0)

1.`tasks`

类型：string function

说明：任意数量的任务函数都可以作为单独的参数传递。如果您以前注册过任务，可以使用字符串，但不建议这样做
**避免重复任务**

当运行组合操作时，每个任务将在每次提供时执行。

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


### 4.7 watch()











## 5 Plugin

https://gulpjs.com/plugins/



### gulp-terser

gulp-uglify



### gulp-babel

```
gulp-babel

babel-preset-es2015

```

gulp-clean

```
webpack-stream

```

gulp-debug





### browser-sync

`npm i browser-sync -D`

https://www.dandelioncloud.cn/article/details/1451841139929321473

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

localhost:8081为本地vue项目的地址

````sh
browser-sync start --proxy "localhost:8081" "*"
````



### gulp.spritesmith [#](https://github.com/twolfson/gulp.spritesmith)









## 6 Demo

### 6.1 

### 6.2 gulp + webpack



## 7 源码

orchestrator

vinyl-fs



http://www.zhishichong.com/article/100343



https://gitee.com/M-J/gulp-angular1/tree/master

https://blog.csdn.net/weixin_42524603/article/details/123644192

https://www.jianshu.com/p/fcc97f0fa535







## 补充

### Stream

`pipe`

pipe方法将数据侦听绑定到streams流的源头，然后将接收到的数据导流到目标streams中

https://zhuanlan.zhihu.com/p/477325197

### RxJS 

https://zhuanlan.zhihu.com/p/483747825



源码

http://www.zhishichong.com/article/100343





## 参考资料





Q

1. task中的cb

2. browser-sync http://acgtofe.com/posts/2015/03/more-fluent-with-browsersync





