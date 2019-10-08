$(function(){
    $('img[usemap]').rwdImageMaps();
    //prepage:
    let pre = $('#prepage');//前置頁
    let pre_map = $($('#prepage .timg #taiwanmap').find('area'));// 前置頁地圖區塊
    let ap = $('.ap');//小地圖連結
    let tp = $('.tp');//目標子網頁
    let ul = $('nav>ul');   //nav各區選單
    let li = $('nav>ul>li');//nav選單
    let motag = $('.motag');//mo取代map
    let map = $('.map');//小地圖
    let back = $('#backblock');//back按鈕
    let bear = $('#bear');//吉祥物
    let loadingimg = ['images/south/south1.png','images/south/south2.png','images/south/south3.png','images/south/south4.png','images/south/south5.png','images/south/south6.png',
                        'images/east/east1.png','images/east/east2.png','images/east/east3.png','images/east/east4.png','images/east/east5.png','images/east/east6.png',
                        'images/north/north1.png','images/north/north3.png','images/north/north4.png','images/north/north5.png','images/north/north6.png',
                        'images/middle/middle1.png','images/middle/middle2.png','images/middle/middle3.png','images/middle/middle4.png','images/middle/middle5.png','images/middle/middle6.png'];
                        //loading的圖片位置
    let limg = $('#loadingimg img');//loading圖片
    //loading
    let loadingimgchange = setInterval(function(){
        let num = Math.floor(Math.random()*23+1);
        
        limg.attr('src',loadingimg[num]);
        limg.css('width','100%');
        limg.css('height','100%');
    },400);
    $(window).on('load', function(){
        $('#loading').hide();
        clearInterval(loadingimgchange);
    });

    //前置頁
    pre_map.click(function(){
        //第二次打開能關地圖
        map.hide();
        //前置頁開關
        pre.removeClass('prepage_show');
        pre.addClass('prepage_hide');
        //back出現
        setTimeout(function(){
            back.show();
            back.removeClass('back_hide');
            back.addClass('back_show');
        },1000);
        let thismap = $($(this).attr('href'));
        let thisnav = $($(this).attr('name'));
        if($(window).width() > 600){
        //熊出現 不好看取消
        //bear.removeClass('bh').addClass('bs');
        //map區塊跟nav出現
        thismap.show();
        thisnav.show();
        //隱藏其他區nav
        $(thisnav.siblings()).hide();
        }else{
        let thismap_page1 = $(thismap.children('.title').children('.stitle').eq(0).find('a').attr('href'));
        thismap_page1.show();
        thisnav.show();
        //隱藏其他區nav
        $(thisnav.siblings()).hide();
        tp.trigger('classChange');
        }
        //nav執行功能
        ul.trigger('menushow');
        return false;
    });

    //back按鈕
    back.click(function(){
        pre.removeClass('prepage_hide');
        pre.addClass('prepage_show');
        location.reload() 
        setTimeout(function(){
            back.addClass('back_hide')
            back.removeClass('back_show');
        },1000);
        map.hide();
        tp.hide();
        ul.hide();
    });

    //小地圖跳轉
    ap.click(function(){
        let thispage = $($(this).find('a').attr('href'));
        thispage.fadeIn(500);
        $(thispage.siblings()).fadeOut(500);
        map.fadeOut(500);
        bear.removeClass('bs').addClass('bh');
        ul.trigger('menushow');
        thispage.trigger('classChange');
        return false;
    });

    //menu
    ul.bind('menushow',function(){
        let $this = $(this);
        let titlepage = $this.children('li').eq(0);
        let pageselet = $(titlepage.siblings());
        let rail = $($this.siblings().first());
        if(!($this.css('display') == 'none')){
            if($(window).width() > 600){
                $($this.siblings()).hide();
                rail.show();
                pageselet.hide();
                li.mouseover(function(){
                    pageselet.stop().slideDown(300);
                });
                li.mouseout(function(){
                    pageselet.stop().slideUp(300);
                });
                li.click(function(){
                    let thispage = $($(this).find('a').attr('href'));
                    map.hide();
                    thispage.fadeIn(500);
                    thispage.siblings('.tp').fadeOut(500);
                    thispage.trigger('classChange');
                    return false;
                });
                titlepage.click(function(){
                    tp.hide();
                    $($(this).find('a').attr('href')).show();
                })
            }else {
                rail.show();
                titlepage.html('選擇景點');
                pageselet.hide();
                titlepage.click(function(){
                    pageselet.slideToggle(300);
                });
                rail.click(function(){
                    pageselet.slideToggle(300);
                });
                pageselet.click(function(){
                    let thispage = $($(this).find('a').attr('href'));
                    pageselet.slideUp(300);
                    thispage.fadeIn(500);
                    thispage.siblings('.tp').fadeOut(500);
                    thispage.trigger('classChange');
                    return false;
                });
            }
        }
    });
    //p3 same hight 抓不出height
    /* let seth = $('.page3 .p3'),
        pt = parseInt(seth.css('padding-top')),
        pb = parseInt(seth.css('padding-bottom')),
        bs = seth.css('box-sizing');
    console.log(seth.outerWidth());
    console.log(seth.outerHeight()); */
    /* $(window).on('load',function(){
        let h = 0 ;
        seth.each(function(){
            let self = $(this),
                hSet = self.outerHeight();
            console.log($(this).outerHeight());
            if(hSet > h){
                h = hSet;
            };
        });
        if(bs === 'border-box'){
            seth.css({height:h});
        }else{
            seth.css({height:(h-(pt+pb))});
        }
    }); */
    //手機版
    motag.click(function(){
        let thispage = $($(this).find('a').attr('href'));
        let thisnav = $($(this).find('a').attr('name'));
        let mopageremote = $('.mopageremote');
        let page1 = $(thispage.children('.tp')).eq(0);
        setTimeout(function(){
            back.removeClass('back_hide');
            back.show();
            back.addClass('back_show');
        },1000);
        mopageremote.each(function(){
            if(!($(this).css('display') == 'none')){
                $(this).hide();
            }
        });
        thispage.show();
        page1.show();
        thisnav.show();
        $(thisnav.siblings()).hide();
        ul.trigger('menushow');
        thispage.trigger('classChange');
        return false;
    });
    //-----------------------page animate-----------------//
    tp.bind('classChange',function(){
        pageani();
        if(!($(this).css('display') == 'none')){
            pageani();
            let scrollp2 = function(){
                let offset = $(window).scrollTop() + $(window).height();
                let nsps = $('.nsp');
                nsps.each(function(i){
                    let nsp =$(this);
                    if(nsp.offset().top + nsp.height() / 2  < offset) {
                        nsp.removeClass('nsp').addClass('sp');
                    }
                })
            };
            $(window).on('scroll',scrollp2);
            $(window).trigger('scroll');
        }else{
        };
    });
    let pageani = function pageani(){
        if($('.page2').hasClass('sp')){
            $('.page2').removeClass('sp').addClass('nsp');
        }else if($('.s_page').hasClass('sp')){
            $('.s_page').removeClass('sp').addClass('nsp');
        }
    }
    //-----------------------page animate-----------------//
    //top鈕
    let gotop = $('#gotop');
    $(window).scroll(function(){
        if($(window).scrollTop() > $(window).height()){
            gotop.fadeIn(600);
        }else if($(window).scrollTop() < $(window).height()){
            gotop.fadeOut(600);
        }
    });
    gotop.click(function(){
        $('body,html').animate({
            scrollTop: 0
        },600);
        return false;
    });
});
