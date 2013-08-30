知心组件库 (zxui)
=====================

知心组件库是 ecom ui 1.1 规范的一个轻量级实现。依赖于 [ESL](https://github.com/ecomfe/esl)

[![Build Status](https://travis-ci.org/chriswong/zxui.png?branch=master)](https://travis-ci.org/chriswong/zxui)


### 如何使用

前期准备：

git、nodejs、grunt-cli

获取源码：

	git clone git://github.com/chriswong/zxui.git
	cd zxui

安装依赖：

	npm install

生成文档：

	grunt jsdoc

单元测试：

	grunt test

代码覆盖率：

	grunt cover
	open test/coverage/ui/index.html

查看可用任务：

	grunt --help
	

### 目前实现的组件

- 日历控件 [Calendar](http://chriswong.github.io/zxui/example/Calendar.html)
- 城市选择 [City](http://chriswong.github.io/zxui/example/City.html)
- 分页控件 [Pager](http://chriswong.github.io/zxui/example/Pager.html)
- 浮层提示 [Tip](http://chriswong.github.io/zxui/example/Tip.html)
- 点击统计 [Log](http://chriswong.github.io/zxui/example/log.html)
- 条件过滤 [Filter](http://chriswong.github.io/zxui/example/Filter.html)
- 下拉选项 [Select](http://chriswong.github.io/zxui/example/Select.html)
- 农历控件 [Lunar](http://chriswong.github.io/zxui/example/Lunar.html)
- 延迟加载 [Lazy](http://chriswong.github.io/zxui/example/Lazy.html)
- 选 项 卡 [Tabs](http://chriswong.github.io/zxui/example/Tabs.html)
