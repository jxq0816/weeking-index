;(function(window){
    'use strict';
    function fullpage(el,opt){
        this.el = $(el);
        this.opt = opt;
        this.item = $(this.opt.item, this.el);
        this.len = this.item.length;
        this.prevTime = new Date().getTime();
        this.curIndex = 0;
        this.setScroll = true;
        this.setdom();
        this.addMouseWheelHandler();
        if(this.opt.beforeFunction && typeof this.opt.beforeFunction == 'function'){
            this.opt.beforeFunction(this.curIndex);
        }
    }
    //瀹屽杽dom
    fullpage.prototype.setdom = function(){
        var _this = this,
            _html = this.el.html();
        this.container = $('<div></div>').attr('class', this.opt.container).html(_html).css('height',this.len*100+'%');
        this.el.empty().append(this.container);
        this.item = $(this.opt.item, this.container);
        var totleH = 0;
        this.item.each(function (index,item) {
            totleH += $(item).height();
        })
        this.container.css({'height':totleH + 'px'});
        // this.item.css('height',100/this.len + '%');
        this.menu = $('<div>').attr('class', this.opt.menu).html('<ul></ul>');
        for(var i=0;i<this.len;i++){
            this.menu.find('ul').append('<li><span></span></li>');
        }
        this.menu.find('li:first').addClass('cur');
        this.menu.appendTo($('body'));
        this.menu.find('li').click(function(){
            _this.scrollTo($(this).index());
        })
        $(window).resize(function(){
            _this.scrollTo(_this.curIndex);
        })
    }
    //娉ㄥ唽鐩戝惉榧犳爣婊戝姩
    fullpage.prototype.addMouseWheelHandler = function(){
        var _this = this;
        if (document.addEventListener) {
            document.addEventListener('mousewheel', function(event){
                _this.MouseWheelHandler(event)
            } , false); //IE9, Chrome, Safari, Oper
            document.addEventListener('wheel', function(event){
                _this.MouseWheelHandler(event)
            }, false); //Firefox
            document.addEventListener('DOMMouseScroll', function(event){
                _this.MouseWheelHandler(event)
            }, false); //Old Firefox
        } else {
            document.attachEvent('onmousewheel', function(event){
                _this.MouseWheelHandler(event)
            }); //IE 6/7/8
        }
    }
    //榧犳爣婊戝姩浜嬩欢
    fullpage.prototype.MouseWheelHandler = function(e){
        var curTime = new Date().getTime();
        e = e || window.event;
        var value = e.wheelDelta || -e.deltaY || -e.detail;
        if(!this.setScroll || curTime-this.prevTime<500){
            return;
        }
        this.setScroll = false;
        this.prevTime = curTime;
        if(value>0){
            this.scrolling('up');
        }else{
            this.scrolling('down');
        }
    }
    //涓婁笅婊氬姩浜嬩欢
    fullpage.prototype.scrolling = function(type){
        this.setScroll = false;
        var _top = this.container.css('top'),
            _height = this.el.height(),
            _this = this;
        if(type=='down' && this.curIndex<this.len-1){
            if(this.opt.beforeFunction && typeof this.opt.beforeFunction == 'function'){
                this.opt.beforeFunction(this.curIndex);
            }
            this.curIndex = this.curIndex + 1;
        }else if(type=='up' && this.curIndex>0){
            if(this.opt.beforeFunction && typeof this.opt.beforeFunction == 'function'){
                this.opt.beforeFunction(this.curIndex);
            }
            this.curIndex = this.curIndex - 1;
        }else{
            this.setScroll = true;
            return;
        }
        _top = 0 - this.scrollToWhere(this.curIndex);
        this.container.animate({top:_top},500,'easeInOutCubic',function(){
            if(_this.opt.afterFunction && typeof _this.opt.afterFunction == 'function'){
                _this.opt.afterFunction(_this.curIndex);
            }
            setTimeout(function(){
                _this.setScroll = true;
            }, _this.opt.timeout);
        });
        this.menu.find('li').removeClass('cur');
        this.menu.find('li').eq(this.curIndex).addClass('cur');
    }
    //婊氬姩鍒�
    fullpage.prototype.scrollTo = function(num){
        this.curIndex = num;
        this.menu.find('li').removeClass('cur');
        this.menu.find('li').eq(this.curIndex).addClass('cur');
        var _this = this,
            _height = this.el.height(),
            _top = 0 - this.scrollToWhere(num);
        if(this.opt.beforeFunction && typeof this.opt.beforeFunction == 'function'){
            this.opt.beforeFunction(this.curIndex);
        }
        this.container.animate({top:_top},500,'easeInOutCubic',function(){
            _this.setScroll = true;
            if(_this.opt.afterFunction && typeof _this.opt.afterFunction == 'function'){
                _this.opt.afterFunction(_this.curIndex);
            }
        });
    }
    fullpage.prototype.scrollToWhere = function(num) {
        var where = 0
        this.item.each(function (index,item) {
            if(index > 0 && index <= num){
                where += $(item).height()
            }
        })
        return where
    };
    window.fullpage = fullpage;
})(window)