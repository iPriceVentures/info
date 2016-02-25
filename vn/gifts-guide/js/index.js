$(document).ready(function(){

    $(document).on("scroll", onScroll);
    function onScroll(event){
        var previousScrollTop = 0, scrollLock = false;
        var scrollPos = $(document).scrollTop() + $(window).height()/2.5;
        $('.nav a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav li').removeClass("active"); //added to remove active class from all a elements
                currLink.parent('li').addClass("active");
                if(scrollLock) {
                    $(window).scrollTop(previousScrollTop)
                }
                previousScrollTop = $(window).scrollTop();
                $('#count').html(scrollPos)

            }
            else{
                currLink.removeClass("active");
            }
        });
    }

    $('#header a').click(function(){
        var pageId = $(this).attr('href');
        $('.nav li').removeClass('active');
        $(this).parent('li').addClass('active');
        $('html, body').animate({
            scrollTop: $(pageId).offset().top - $('#header').height()
        }, 500);
        return false
    })
})