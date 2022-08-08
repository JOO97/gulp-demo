# Gulp

## 1 setup

````shell
npm install --global gulp-cli
````

````shell
npm install --save-dev gulp
````

![image-20220805111024477](C:\Users\LEGION\AppData\Roaming\Typora\typora-user-images\image-20220805111024477.png)



## 2 基本概念

module

1. commonjs
2. es module： `gulpfile.esm.js`



task

1. 异步
2. **public** or **private**
3. 任务组合
   - series() 顺序执行
   - parallel() 最大程度的并发执行





## 3 api

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





## 3 Plugin

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





https://gitee.com/M-J/gulp-angular1/tree/master

https://blog.csdn.net/weixin_42524603/article/details/123644192