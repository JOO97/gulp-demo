# Gulp

## 1 Intro

### 1.1 前端工程化

https://gulpjs.com/



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

#### gulp中的任务

- 每个gulp任务都是一个异步的JavaScript函数

- 可以是接受一个callback作为参数的函数，调用callback函数即任务结束

- 或者是一个返回stream、promise、event emitter、child process或observable类型的函数

#### 创建方式



#### 任务函数类型

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





#### 公开/私有任务

- **公开任务（Public tasks）** 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用；
- **私有任务（Private tasks）** 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分；

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

### 4.1 Concept





1. pipe

2. src

3. task

````javascript
task('clean', () => {
  return src('build/*', { allowEmpty: true, read: false }).pipe(clean())
})
````

````shell
npx gulp clean
````

4. series
5. parallel
6. 







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



## 6 Demo





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



Q

1. task中的cb

2. browser-sync





