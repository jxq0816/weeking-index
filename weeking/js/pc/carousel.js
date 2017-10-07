function Carousel (dom,opt) {
    this.dom = dom
    this.autoMoveTimer = null

    this.opt = {
        gap: opt.gap || 0,
        visibleItem : opt.visibleItem || 1,
        carouselOn : opt.carouselOn || false,
        leftDom : opt.leftDom || false,
        rightDom : opt.rightDom || false,
        moveTime : opt.moveTime || 500,
        autoMoveTime : opt.autoMoveTime || 5000,
        menu : opt.menu || false,
        action : opt.action || 'move'
    }

    this.leftDom = this.opt.leftDom
    this.rightDom = this.opt.rightDom

    this.init()
    this.bindEvent()

}



Carousel.prototype.init = function() {
    this.index = 0
    $(this.dom).css({position:'absolute',top:'0'})
    this.checkArrow()
    this.setWidth()
    if(this.opt.carouselOn === true){
        this.autoMove()
    }
    if(this.opt.menu !== false){
        this.setMenu()
    }
};

Carousel.prototype.setMenu = function() {
    var html = ''
    for(var i = 0 ; i < $(this.dom).find('li').length ; i++ ){
        html += '<li></li>'
    }
    html = '<ul>'+html+'</ul>'
    $(this.opt.menu).html(html)
    $(this.opt.menu).find('li').eq(0).addClass('cur')
};

Carousel.prototype.autoMove = function() {
    clearTimeout(this.autoMoveTimer)
    var that = this
    this.autoMoveTimer = setTimeout(function () {
        that.index ++
        if(that.index > $(that.dom).find('li').length - that.opt.visibleItem){
            that.index = 0
        }
        if(that.opt.action == 'move'){
            that.move()
        }
        if(that.opt.action == 'change'){
            that.change()
        }
        that.autoMove()
    },that.opt.autoMoveTime)
};

Carousel.prototype.checkArrow = function() {
    if(!this.leftDom || !this.rightDom) return false
    if(this.index == 0){
        $(this.leftDom).addClass('hide')
    }else if(this.index > 0){
        $(this.leftDom).removeClass('hide')
    }
    if($(this.dom).find('li').length <= this.opt.visibleItem){
        $(this.rightDom).addClass('hide')
    }
    if(this.index >= $(this.dom).find('li').length - this.opt.visibleItem ){
        $(this.rightDom).addClass('hide')
    }else{
        $(this.rightDom).removeClass('hide')
    }

};

Carousel.prototype.setWidth = function() {
    var lis = $(this.dom).find('li')
    var liWidth = lis.eq(0).width()
    var width = (liWidth + this.opt.gap)*lis.length
    $(this.dom).width(width)
};

Carousel.prototype.changeMenu = function() {
    if(this.opt.menu === false) return false
    $(this.opt.menu).find('li').eq(this.index).addClass('cur').siblings().removeClass('cur')
};

Carousel.prototype.bindEvent = function() {
    var that = this
    if(!(!this.leftDom || !this.rightDom)){
        $(this.leftDom).click(function () {
            that.clickEvent('left')
        })

        $(this.rightDom).click(function () {
            that.clickEvent('right')
        })
    }

    if(this.opt.menu !== false){
        $(this.opt.menu).find('li').click(function () {
            that.menuClickEvent($(this).index())
        })
    }

};

Carousel.prototype.menuClickEvent = function(index) {
    this.index = index;
    // clearTimeout(this.autoMoveTimer)
    if(this.opt.action == 'move'){
        this.move();
    }
    if(this.opt.action == 'change'){
        this.change();
    }
};

Carousel.prototype.clickEvent = function(str) {

    if(str == 'left'){
        this.index --
    }else if(str == 'right'){
        this.index ++
    }
    if(this.index < 0  ){
        this.index = 0
    }
    if( this.index > $(this.dom).find('li').length - this.opt.visibleItem){
        this.index = $(this.dom).find('li').length - this.opt.visibleItem
    }
    clearTimeout(this.autoMoveTimer)
    this.move()
};

Carousel.prototype.move = function() {
    var that = this
    var step =  $(this.dom).find('li').eq(0).width() + this.opt.gap
    $(this.dom).animate({
        left:step*this.index * -1
    },this.opt.moveTime,function(){
        that.checkArrow()
        that.changeMenu()
    })
};

Carousel.prototype.change = function() {
    $(this.dom).find('li').eq(this.index).addClass('cur').siblings().removeClass('cur')
    this.changeMenu()
};