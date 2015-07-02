$(window).scroll(function() {
    var divHeight = $(window).height() * 1;
    var divIndex = $(window).scrollTop() / divHeight;

    $("#n1").append(function() {

        if (divIndex < 1) {
            $("#n1").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n1").css({
                opacity: '0.4'
            }, 1);
        }

    });

    $("#n2").append(function() {

        if (divIndex >= 1 && divIndex < 2.19) {
            $("#n2").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n2").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#n3").append(function() {

        if (divIndex >= 2.19 && divIndex < 3.39) {
            $("#n3").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n3").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#n4").append(function() {

        if (divIndex >= 3.39 && divIndex < 4.59) {
            $("#n4").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n4").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#n5").append(function() {

        if (divIndex >= 4.59 && divIndex < 5.79) {
            $("#n5").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n5").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#n6").append(function() {

        if (divIndex >= 5.79 && divIndex < 6.99) {
            $("#n6").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n6").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#n7").append(function() {

        if (divIndex >= 6.99 && divIndex < 8.19) {
            $("#n7").css({
                opacity: '1'
            }, 1);
        } else {
            $("#n7").css({
                opacity: '0.4'
            }, 1);
        }
    });

    $("#intro a").append(function() {

        if (divIndex < 1) {
            $("#intro a").attr("href", "#sixties");
        }
        if (divIndex >= 1) {
            $("#intro a").attr("href", "#seventies");
        }
        if (divIndex >= 2.19) {
            $("#intro a").attr("href", "#eighties");
        }
        if (divIndex >= 3.39) {
            $("#intro a").attr("href", "#nineties");
        }
        if (divIndex >= 4.59) {
            $("#intro a").attr("href", "#noughties");
        }
        if (divIndex >= 5.79) {
            $("#intro a").attr("href", "#exit");
        }
        if (divIndex >= 6.99) {
            $("#intro a").css({
                display: 'none'
            }, 1);
        } else {
            $("#intro a").css({
                display: 'block'
            }, 1);
        }

    });

});