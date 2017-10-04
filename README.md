MINA Pages 命令行工具
==============================

## MINA Pages 

### 一、简介
本工具为 MINA Pages 应用开发工具。 关于MINA Pages 以及如何安装 NodeJS 请参考以下文档

[团队猫手册 > MINA Pages > 快速开发指南](http://book.tuanduimao.com/357326) 


### 二、安装命令行工具

#### 第一步: 下载命令行工具

```bash
git clone https://github.com/XpmJS/mina-command.git 

```


#### 第二步: 安装依赖包

```bash
npm install

```

#### 第三步: 创建可执行链接

```bash
# Linux & Mac 
chmod +x mp.js 

# 创建命令链接
npm link

```


## MINA Pages 命令行工具


### 一、WEB 网站

#### 新建页面 `mp web -n [some/dir/]<page>`



```bash
mp web -n hello

```

以上命令运行完毕，会在当前目录下创建 `hello.page`，`hello.js`,  `hello.json`, `hello.less`  四个文件

```bash
mp web -n /code/mpapps/web/hello

```
以上命令运行完毕，会在 `/code/mpapps/web/` 目录下创建 `hello.page`，`hello.js`,  `hello.json`, `hello.less`  四个文件



#### 删除页面 `mp web -n [some/dir/]<page>`



```bash
mp web -d hello

```

以上命令运行完毕，会在删除当前目录下 `hello.page`，`hello.js`,  `hello.json`, `hello.less`  四个文件


```bash
mp web -d /code/mpapps/web/hello

```
以上命令运行完毕，会在删除 `/code/mpapps/web/` 目录下创建 `hello.page`，`hello.js`,  `hello.json`, `hello.less`  四个文件




#### 复制页面 `mp web -c [some/dir/]<source page> [some/dir/]<dest page>`



```bash
mp web -c hello world

```

以上命令运行完毕，会在当前目录下将 `hello.page`，`hello.js`,  `hello.json`, `hello.less` 四个文件, 复制到当前目录下, 命名为 `world.page`，`world.js`,  `world.json`, `world.less` 。


```bash
mp web -c /code/mpapps/web/hello world

```

以上命令运行完毕，会在`/code/mpapps/web/` 目录下将 `hello.page`，`hello.js`,  `hello.json`, `hello.less` 四个文件, 复制到当前目录下, 命名为 `world.page`，`world.js`,  `world.json`, `world.less` 。



```bash
mp web -c /code/mpapps/web/hello /code/newapps/web/world

```

以上命令运行完毕，会在`/code/mpapps/web/` 目录下将 `hello.page`，`hello.js`,  `hello.json`, `hello.less` 四个文件, 复制到`/code/newapps/web/`目录下, 命名为 `world.page`，`world.js`,  `world.json`, `world.less` 。



### 二、WXAPP 微信小程序

(稍后完善)


### 三、APP 移动应用

(稍后完善)


