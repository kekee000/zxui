/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 轮播组件
 * @author  mengke01(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');
    var Anim = require('./SliderAnim');

    /**
     * 获得当前元素的所有子元素
     * 
     * @param {HTMLElement} element 当前元素
     * @return {Array.<HTMLElement>} 子元素集合
     */
    function getChildren(element) {

        if(element.children) {
            return element.children;
        }

        for(
            var children=[], curElement=element.firstChild;
            curElement;
            curElement=curElement.nextSibling
        ){
            if(curElement.nodeType==1){
                children.push(curElement);
            }
        }
        return children;
    }

    /**
     * 轮播组件
     * 
     * 提供图片以及滚动框的轮播
     * @extends module:Slider
     * @requires lib
     * @requires Control
     * @exports Slider
     * @example
     * new Slider({
     *     main: lib.q('pager-container')[0],
     *     onChange: function (e) {
     *         
     *     }
     *  }).render();
     */
    var Slider = Control.extend(/** @lends module:Slider.prototype */{

        /**
         * 获得元素的子元素集合
         * 
         * @type {Function}
         */
        getChildren: getChildren,

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Slider',

        /**
         * Anim对象，用来作为接口扩展
         * 
         * @type {Anim}
         */
        Anim: Anim,

        /**
         * 控件配置项
         * 
         * @name module:Pager#optioins
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @private
         */
        options: {

            // 控件的不可用状态
            disabled: false,

            // 控件主容器
            main: '',

            // 控件动画容器，如果不设则按class规则查找`options.prefix` + `stage`
            stage: '',

            //prev按钮的容器，如果不设则按class规则查找`options.prefix` + `stage`
            prevElement: '',

            //next按钮的容器，如果不设则按class规则查找`options.prefix` + `stage`
            nextElement: '',

            //轮播索引按钮的容器，会将第一级子元素设为索引元素，
            // 如果不设则按class规则查找`options.prefix` + `stage`
            indexElment: '',

            //是否自动轮播
            auto: true,
            
            //是否播放到结尾时回到起始，在自动轮播下，需要设置为true
            circle: true,

            //点击切换动画的延迟时间
            autoInterval: 2000,

            //点击切换索引的延迟时间
            switchDelay: 50,

            //使用的轮播动画
            anim: 'default',

            //轮播动画选项，不同的动画效果配置可能不一样
            animOptions: {

                //使用的动画算子
                easing: '',
                
                //每次动画时间间隔
                interval: 200,

                //滑动门门的滚动方向
                direction: ''
            },

            //当播放位置改变时的事件
            onChange: null,

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-slider'
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         * @private
         */
        binds: 'onEnter,onLeave,'
                + 'switchHandler,onPrevClick,'
                + 'onNextClick,onIndexClick',

        /**
         * 根据名字构建的css class名称
         *  
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function(name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        },

        /**
         * 进入主窗口的事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onEnter: function(e) {
            if(this.options.auto) {
                clearTimeout(this.switchTimer);
            }
        },

        /**
         * 离开主窗口的事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onLeave: function(e) {
            //如果使用自动轮播，则触发轮播计时
            if(this.options.auto) {
                this.play();
            }
        },

        /**
         * 自动切换处理事件
         * @private
         */
        switchHandler: function() {
            this.next();
            this.play();
        },

        /**
         * 如果是自动播放，则激活轮播
         * @private
         */
        play: function() {
            if(this.options.auto) {
                clearTimeout(this.switchTimer);
                this.switchTimer = setTimeout(
                    this.switchHandler, 
                    this.options.autoInterval
                );
            }
        },

        /**
         * 获得轮播的索引
         * 
         * @param {Number} index 设置的索引
         * @return {Number} 计算后的索引
         * @private
         */
        getIndex: function(index) {

            var goTo = this.index;

            if(index === 'start') {
                goTo = 0;
            }
            else if(index === 'end') {
                goTo = this.count - 1;
            }
            else {
                goTo = index;
            }

            if(goTo == this.index) {
                return -1;
            }

            if(goTo >= this.count) {
                goTo = this.options.circle ? 0 : this.count - 1;
            }
            else if(goTo < 0) {
                goTo = this.options.circle ? this.count - 1 : 0;
            }

            return goTo;
        },

        /**
         * 上一个按钮点击事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onPrevClick: function(e) {
            var me = this;
            if(!me.switchDelayTimer) {
                me.switchDelayTimer = setTimeout(function() {
                    me.clearSwitchDelayTimer();
                    me.prev();
                }, me.options.switchDelay);
            }
        },

        /**
         * 下一个按钮点击事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onNextClick: function(e) {
            var me = this;
            if(!me.switchDelayTimer) {
                me.switchDelayTimer = setTimeout(function() {
                    me.clearSwitchDelayTimer();
                    me.next();
                }, me.options.switchDelay);
            }
        },
        
        /**
         * 索引的点击事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onIndexClick: function(e) {
            var me = this;
            var target = lib.getTarget(e);
            if( target['data-index'] !=='' && !me.switchDelayTimer) {
                var index = target.getAttribute('data-index');
                me.switchDelayTimer = setTimeout(function() {
                    me.clearSwitchDelayTimer();
                    me.go(+index);
                }, me.options.switchDelay);
            }
        },

        /**
         * 清除切换延迟
         * 
         * @private
         */
        clearSwitchDelayTimer: function() {
            clearTimeout(this.switchDelayTimer);
            this.switchDelayTimer = 0;
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Pager#options
         * @private
         */
        init: function (options) {

            this.disabled  = options.disabled;

            if (options.main) {
                this.main = lib.g(options.main);
                lib.addClass(this.main, options.prefix);
                lib.on(this.main, 'mouseenter', this.onEnter);
                lib.on(this.main, 'mouseleave', this.onLeave);

                //根据class查找未知的元素
                options.stage = options.stage 
                    || lib.q(this.getClass('stage'), this.main)[0];

                //根据class查找未知的元素
                options.prevElement = options.prevElement 
                    || lib.q(this.getClass('prev'), this.main)[0];

                options.nextElement = options.nextElement 
                    || lib.q(this.getClass('next'), this.main)[0];

                options.indexElment = options.indexElment 
                    || lib.q(this.getClass('index'), this.main)[0];

                if(options.prevElement) {
                    lib.on(options.prevElement, 'click', this.onPrevClick);
                }

                if(options.nextElement) {
                    lib.on(options.nextElement, 'click', this.onNextClick);
                }

                if(options.indexElment) {
                    lib.on(options.indexElment, 'click', this.onIndexClick);
                }

                //设置当前的动画组件
                this.curAnim = new Anim.anims[options.anim](
                    this, 
                    options.animOptions
                );
            }
        },

        /**
         * 刷新当前播放舞台
         * 
         * @return {module:Slider} 当前对象
         */
        refresh: function() {
            //使用第一个轮播元素的宽和高为舞台的宽和高
            var me = this;
            var opt = this.options;
            var childNodes = getChildren(opt.stage);

            //设置item样式
            lib.each(
                childNodes, 
                function(item, index) {
                    lib.addClass(item, me.getClass('item'));
                }
            );

            //设置索引项目
            if(opt.indexElment) {
                lib.each(
                    getChildren(opt.indexElment), 
                    function(item, index) {
                        item.setAttribute('data-index', index);
                    }
                );
            }

            me.stage = opt.stage;
            me.index = 0;
            me.count = childNodes.length;
            me.stageWidth = opt.stage.clientWidth;
            me.stageHeight = opt.stage.clientHeight;

            me.setCurrent();
            me.curAnim.refresh();
        },

        /**
         * 切换到当前索引，设置选中项目
         * @private
         */
        setCurrent: function() {
            var opt = this.options;

            //如果不是循环模式，则设置prev按钮为不可点击
            if(opt.prevElement) {
                lib[
                    this.index == 0 && !opt.circle
                    ? 'addClass' : 'removeClass'](
                        opt.prevElement,
                        this.getClass('prev-disable')
                    );
            }

            //如果不是循环模式，则设置next按钮为不可点击
            if(opt.nextElement) {
                lib[
                    this.index == this.count -1 && !opt.circle
                    ? 'addClass' : 'removeClass'](
                        opt.nextElement,
                        this.getClass('next-disable')
                    );
            }

            //选中索引条目
            if(opt.indexElment) {
                var elements = getChildren(opt.indexElment);
                elements[this.lastIndex] &&
                    lib.removeClass(
                        elements[this.lastIndex], 
                        this.getClass('index-selected')
                    );
                lib.addClass(
                    elements[this.index], 
                    this.getClass('index-selected')
                );
            }

        },

        /**
         * 绘制控件
         * 
         * @return {module:Slider} 当前实例
         * @override
         * @public
         */
        render: function () {
            this.refresh();
            this.play();
            return this;
        },

        /**
         * 切换到前一个
         * 
         * @return {module:Slider} 当前对象
         */
        prev: function() {
            this.go(this.index - 1);
        },

        /**
         * 切换到后一个
         * 
         * @return {module:Slider} 当前对象
         */
        next: function() {
            this.go(this.index + 1);
        },

        /**
         * 切换到的索引
         * 
         * @param {Number|string} index 切换到的索引，可以设置数字或者'start'|'end'
         * @return {module:Slider} 当前对象
         * @fires module:Slider#change
         */
        go: function(index) {

            var goTo = this.getIndex(index);
            if(goTo == -1) {
                return;
            }

            //如果可以切换到当前的索引
            if( false !== this.curAnim.switchTo(goTo, this.index) ) {

                this.lastIndex = this.index;
                this.index = goTo;

                this.setCurrent();

                var event = {
                    index: goTo,
                    lastIndex: this.lastIndex
                };

                this.options.onChange && this.options.onChange(event);
                
                /**
                 * @event module:Slider#change
                 * @type {Object}
                 * @property {number} index 当前的索引
                 */
                this.fire('change', event);
            }
        }

    });

    return Slider;
});
