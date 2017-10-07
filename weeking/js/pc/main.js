gz = window.gz || {};
$(document).ready(function() {
    checkHeight();
    gz.page = [1, 1, 1, 1, 1, 1, 1];
    //璁剧疆瀹介珮
    var _maxH = $(window).height();
    // triangleDeg ()
    $('.page').css({'height':_maxH+'px'})
    $('.footer').css({'height':'260px'})
    $(window).resize(function(){
        checkHeight();
        var _maxH = $(window).height();
        // triangleDeg ()
        $('.page').css({'height':_maxH+'px'})
        $('.footer').css({'height':'260px'})
    })
    function checkHeight(){
        if ( $(window).height() < 660 ) fixedHeight(1);
        if ( $(window).height() >= 660 ) fixedHeight(0);
    }
    function fixedHeight(type){
        // if ( type === 1 ) {
        // 	$('.page3 .tb').css('margin-bottom','0');
        // 	$('.page3 .cb').css('margin-top','-200px');
        // }
        // if ( type === 0 ) {
        // 	$('.page3 .tb').css('margin-bottom','60px');
        // 	$('.page3 .cb').css('margin-top','-260px');
        // }
    }
    var count = 0;
    function loop(){
        setTimeout(function(){
            count ++;
            if ( count%2 === 0 ) {
                $('.baobiao1').addClass('cur');
                $('.baobiao2').removeClass('cur');
            } else {
                $('.baobiao2').addClass('cur');
                $('.baobiao1').removeClass('cur');
            }
            loop();
        },6000);
    }
    loop();
    function triangleDeg () {
        var tH = $('.triangle').height();
        var tW = $('.triangle').width();
        var deg = (Math.atan(tH/tW))*180/Math.PI
        $('.triangle').css({'background':'linear-gradient('+deg+'deg,#f5f5f5 50%,#fff 0)'})

        var wxtH = $('.spWX').height();
        var wxtW = 300;
        var wxdeg = (Math.atan(wxtH/wxtW))*180/Math.PI
        $('.spWX').css({'background':'linear-gradient('+wxdeg+'deg,#f5f5f5 300px,#fff 0px)'})
    }

    //鍒濆鍖�
    gz.fullpage = new fullpage('#fullpage',{
        item: '.section',
        container: 'container',
        menu: 'menu',
        timeout: 1000,
        beforeFunction: function(num){
            // $('.page').eq(num).removeClass('cur')
        },
        afterFunction: function(num){
            $('.page').eq(num).addClass('cur')
        }
    });
    gz.fullpage.scrollTo(0);

});
//鍏抽棴娴姩
gz.closeTotal = function (obj){
    $(obj).fadeOut();
    $('.total').animate({opacity: '0'}, 300 , function(){
        $('.total').removeClass('fixed').css('opacity',1).addClass('absolute');
    })
    $('#video').remove();
}