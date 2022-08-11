# Gulp

## 1 Intro

### 1.1 前端工程化

https://gulpjs.com/

### 1.2 Node Stream

pipe

pipeline

event

https://www.lmlphp.com/user/16675/article/item/575940/

## 2 Usage

### 2.1 SetUp

````shell
npm install --global gulp-cli
````

````shell
npm install --save-dev gulp
````

![image-20220805111024477](C:\Users\LEGION\AppData\Roaming\Typora\typora-user-images\image-20220805111024477.png)

### 2.2 Create a gulpfile

1. 创建`gulpfile.js`

2. 创建默认任务

````javascript
exports.default = cb => {
  cb()
}
````

3. run task

````sh
gulp 
````

4. 



## 3 Basic

### 3.1 CLI

命令 `gulp [flags] <task> <task> ...`

说明

1. `gulp` 执行当前目录下gulpfile.js中的默认任务

2. `gulp 任务名称` 执行指定任务, 若要执行多个任务，任务间以空格分割

3. flags

   - `-f`  指定gulpfile目录

   - `-T`  打印当前所有任务依赖树

   - `--tasks-simple` 打印当前所有任务

   - [文档参考](https://github.com/gulpjs/gulp-cli/blob/master/docs/CLI.md)

### 3.2 Task

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

//方法二
const task2 = cb => {
  cb()
}
task(task2)

//方法三
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

#### 

















module

1. commonjs
2. es module： `gulpfile.esm.js`



task

1. 异步
2. **public** or **private**
3. 任务组合
   - series() 顺序执行
   - parallel() 最大程度的并发执行





## 4 API

### 4.1 Concepts

http://acgtofe.com/posts/2015/09/dive-into-gulp-stream

#### Vinyl File Object

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



#### Glob

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



### 4.2 src()

`src(globs, [options])`

**Parameters** [#](https://gulpjs.com/docs/en/api/src#parameters)

`globs`

类型：string array

`options`

类型：object

说明: 

- allowEmpty:  当 `globs` 参数匹配一个指定文件时(如 `src/empty.js`) 而且没有找到匹配或匹配到的文件内容为空，会抛出一个错误，提示 "File not found with singular glob"，此时需要将 `allowEmpty` 选项设置为 `true`
- read：当不需要读取匹配到的文件时，可将`read`设置为`true`
- 其余参数请参考 https://gulpjs.com/docs/en/api/src#options

**Usage**

````javascript
const { src, dest } = require('gulp')

const copy = ()=>{
  return src('src/js/*.js')
    .pipe(dest('build/'))
}
exports.copy = copy
````



### dest()

`dest(directory, [options])`

**Parameters** [#](https://gulpjs.com/docs/en/api/dest#parameters)

`directory`

类型：string function

说明: 



`options`

类型：object

说明: 

- overwrite
- append
- sourcemaps
- 其余参数请参考 https://www.gulpjs.com.cn/docs/api/dest/#%E9%80%89%E9%A1%B9

### ？symlink()

软链接

fs.symlink https://nodejs.org/api/fs.html#fssymlinktarget-path-type-callback

https://baijiahao.baidu.com/s?id=1711929846570027467&wfr=spider&for=pc

### task()

### series()

### parallel()

### watch()











## 5 Plugin

gulp-uglify

babel

```
gulp-babel

babel-preset-es2015

```

gulp-clean

```
webpack-stream

```

gulp-debug

## 6 Demo





## 7 源码

orchestrator

vinyl-fs



http://www.zhishichong.com/article/100343



https://gitee.com/M-J/gulp-angular1/tree/master

https://blog.csdn.net/weixin_42524603/article/details/123644192

https://www.jianshu.com/p/fcc97f0fa535







## 补充知识

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





