(function ($) {
    "use strict";
    $.getJSON('https://api.coinmarketcap.com/v1/ticker/',
        function (json) {
            var tr;
            var mr;

            for (var i = 0; i < json.length; i++) {
                if (json[i].percent_change_24h > 0) {
                    tr = $('<tr><th scope="row"><div class="media"><div class="d-flex mr-2"><img src="https://s2.coinmarketcap.com/static/img/coins/32x32/' + json[i].rank + '.png" alt="" class="img-fluid" /></div><div class="media-body align-self-center">' + json[i].name + '.</div></div></th><td>' + json[i].price_usd + '.</td><td><i class="ion-arrow-graph-up-right pr-1 text-success"></i> ' + json[i].percent_change_24h + '.</td><td>' + json[i]["24h_volume_usd"] + '.</td><td>' + json[i].available_supply + '.</td></tr>');
                }
                else {
                    tr = $('<tr><th scope="row"><div class="media"><div class="d-flex mr-2"><img src="https://s2.coinmarketcap.com/static/img/coins/32x32/' + json[i].rank + '.png" alt="" class="img-fluid" /></div><div class="media-body align-self-center">' + json[i].name + '.</div></div></th><td>' + json[i].price_usd + '.</td><td><i class="ion-arrow-graph-up-right pr-1 text-danger"></i> ' + json[i].percent_change_24h + '.</td><td>' + json[i]["24h_volume_usd"] + '.</td><td>' + json[i].available_supply + '.</td></tr>');
                }
                if (json[i].percent_change_24h > 0) {
                    mr = $('<div class="item text-center py-2"><a href="javascript:;"><span class="price-name text-uppercase text-white font-weight-bold">USD / ' + json[i].symbol + '</span><span class="price-value d-block text-muted">' + json[i].price_usd + ' </span><span class="price-change text-success">+' + json[i].percent_change_24h + '% <i class="ion-arrow-graph-up-right"></i></span></a></div>');
                }
                else {
                    mr = $('<div class="item text-center py-2"><a href="javascript:;"><span class="price-name text-uppercase text-white font-weight-bold">USD / ' + json[i].symbol + '</span><span class="price-value d-block text-muted">' + json[i].price_usd + ' </span><span class="price-change text-danger">-' + json[i].percent_change_24h + '% <i class="ion-arrow-graph-up-right"></i></span></a></div>');
                }
                $('#tablebody').append(tr);
                $('.marquee-with-options .marquee').append(mr);
            }

            $('.marquee').marquee({
                duration: 30000,
                gap: 50,
                delayBeforeStart: 0,
                direction: 'left',
                duplicated: true
            });

        });


    /*==============================================================
     Header Fixed Js 
     ============================================================= */
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 0) {
            $("#header-fix").addClass("active");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
            $("#header-fix").removeClass("active");
        }
    });
    /*==============================================================
     Counter Js 
     ============================================================= */
    $('.counter_number').counterUp({
        delay: 1,
        time: 1600
    });
    // leanmodel
    var loginform = $(".login_form");
    var loginform_link = $(".loginform_link");
    var userlogin = $(".user_login");
    var userregister = $(".user_register");
    // Plugin options and our code
    loginform.leanModal({
        top: 50,
        overlay: 0.6,
        closeButton: ".modal_close"
    });


    // Calling Login Form
    $(".loginform_link").on('click', function () {
        userregister.hide();
        userlogin.show();
        return false;
    });
    // Calling Register Form
    $(".register_form").on('click', function () {
        userlogin.hide();
        userregister.show();
        $(".header_title").text('Register');
        return false;
    });
    /*==============================================================
     Image Convert to Background Image Js 
     ============================================================= */

    $('.background-image-maker').each(function () {
        var imgURL = $(this).next('.holder-image').find('img').attr('src');
        $(this).css('background', 'white');
        // $(this).css('background-image', 'url(' + imgURL + ')');
    });
    /*==============================================================
     Back To Top Js 
     ============================================================= */

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
    /*==============================================================
     Slick Testimonial Slider Js 
     ============================================================= */
    $('.testimonial').slick({
        centerMode: true,
        dots: false,
        centerPadding: '0px',
        arrows: false,
        slidesToShow: 3,
        autoPlay: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    /*==============================================================
     Partner Slider Js 
     ============================================================= */
    $("#img-carousal").owlCarousel({
        items: 5,
        pagination: false,
        autoPlay: false
    });
    /*==============================================================
     Partner Slider Js 
     ============================================================= */
    $("#owl-testimonial").owlCarousel({
        items: 1,
        pagination: false,
        autoPlay: true,
        nav: true,
        autoplayTimeout: 8500,
        smartSpeed: 450,
        navText: ['<i class="lnr lnr-arrow-left"></i>', '<i class="lnr lnr-arrow-right"></i>']
    });
    /*==============================================================
     Back To Top Js 
     ============================================================= */
    new WOW().init();

    /*==============================================================
     CountdownJs 
     ============================================================= */
    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');
        function updateClock() {
            var t = getTimeRemaining(endtime);
            daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
            if (t.total <= 0) {
                clearInterval(timeinterval);
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

    var deadline = new Date(Date.parse(new Date()) + 28 * 11 * 28 * 60 * 1000);
    if ($('#clockdiv').length) {
        initializeClock('clockdiv', deadline);
    }

    /*==============================================================
     High Chart Js 
     ============================================================= */
    if ($('#chartContainer').length > 0) {
        window.onload = function () {

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                exportEnabled: true,
                axisX: {
                    valueFormatString: "MMM"
                },
                axisY: {
                    includeZero: false,
                    prefix: "$",
                    title: ""
                },
                axisY2: {
                    prefix: "$",
                    suffix: "bn",
                    title: "",
                    tickLength: 0
                },
                toolTip: {
                    shared: false
                },
                legend: {
                    reversed: true,
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "candlestick",
                    showInLegend: true,
                    name: "Stock Price",
                    yValueFormatString: "$#,##0.00",
                    xValueFormatString: "MMMM",
                    dataPoints: [// Y: [Open, High ,Low, Close]
                        { x: new Date(2016, 0), y: [101.949997, 112.839996, 89.370003, 112.209999] },
                        { x: new Date(2016, 1), y: [112.269997, 117.589996, 96.820000, 106.919998] },
                        { x: new Date(2016, 2), y: [107.830002, 116.989998, 104.400002, 114.099998] },
                        { x: new Date(2016, 3), y: [113.750000, 120.790001, 106.309998, 117.580002] },
                        { x: new Date(2016, 4), y: [117.830002, 121.080002, 115.879997, 118.809998] },
                        { x: new Date(2016, 5), y: [118.500000, 119.440002, 108.230003, 114.279999] },
                        { x: new Date(2016, 6), y: [114.199997, 128.330002, 112.970001, 123.940002] },
                        { x: new Date(2016, 7), y: [123.849998, 126.730003, 122.070000, 126.120003] },
                        { x: new Date(2016, 8), y: [126.379997, 131.979996, 125.599998, 128.270004] },
                        { x: new Date(2016, 9), y: [128.380005, 133.500000, 126.750000, 130.990005] },
                        { x: new Date(2016, 10), y: [131.410004, 131.940002, 113.550003, 118.419998] },
                        { x: new Date(2016, 11), y: [118.379997, 122.500000, 114.000000, 115.050003] }
                    ]
                },
                ]
            });
            chart.render();
            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        }
    }

    /*==============================================================
     Revolution Slider Js 
     ============================================================= */
    var tpj = jQuery;
    var revapi490;
    tpj(document).ready(function () {
        if (tpj("#rev_slider_490_1").revolution == undefined) {
            revslider_showDoubleJqueryError("#rev_slider_490_1");
        } else {
            revapi490 = tpj("#rev_slider_490_1").show().revolution({
                sliderType: "standard",
                sliderLayout: "fullwidth",
                dottedOverlay: "none",
                delay: 9000,
                navigation: {
                    keyboardNavigation: "off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation: "off",
                    mouseScrollReverse: "default",
                    onHoverStop: "off",
                    touch: {
                        touchenabled: "on",
                        swipe_threshold: 75,
                        swipe_min_touches: 1,
                        swipe_direction: "horizontal",
                        drag_block_vertical: false
                    }
                    ,
                    bullets: {
                        enable: true,
                        hide_onmobile: true,
                        hide_under: 768,
                        style: "hermes",
                        hide_onleave: false,
                        direction: "horizontal",
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 30,
                        space: 5,
                        tmp: ''
                    }
                },
                responsiveLevels: [1240, 1199, 778, 480],
                visibilityLevels: [1240, 1024, 778, 480],
                gridwidth: [1240, 1024, 778, 480],
                // gridheight: [750, 750, 600, 500],
                gridheight: [750, 750, 750, 750],
                // gridheight: ["100%", "100%", "100%", "100%"],
                lazyType: "none",
                parallax: {
                    type: "mouse",
                    origo: "slidercenter",
                    speed: 2000,
                    levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55],
                    type: "mouse",
                },
                shadow: 0,
                spinner: "off",
                autoHeight: "on",
                disableProgressBar: "on",
                hideThumbsOnMobile: "off",
                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                debugMode: true,
                fallbacks: {
                    simplifyAll: "off",
                    disableFocusListener: false,
                }
            });
            
            // Set slider height on window resize
            tpj(window).on('resize', function () {
                revapi490.revredraw(); // Trigger redraw on resize
                var newHeight = tpj(window).height();
                revapi490.revSliderSizing({ height: newHeight, autoHeight: "on" });
            });
        }   // Set initial height


    }); /*ready*/


    /*============================================================
     * Calculator
     ===========================================================*/


    // Calling Login Form
    $('.coinvalue').on('blur', function () {
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + $('#coin').val() + "&tsyms=" + $('#currency').val(),
            dataType: 'json'
            ,
            success: function (response) {
                var n;
                var t;
                for (n in response) {

                    var val = response[n];// value where key is n
                    for (n in val) {

                        val = val[n];// value where key is n
                        $('.currencyvalue').val(val * $('.coinvalue').val());
                    }

                }


            }
        });
    });


    $('.currencyvalue').on('blur', function () {
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + $('#currency').val() + "&tsyms=" + $('#coin').val(),
            dataType: 'json'
            ,
            success: function (response) {
                var n;
                var t;
                for (n in response) {

                    var val = response[n];// value where key is n
                    for (n in val) {

                        val = val[n];// value where key is n
                        $('.coinvalue').val(val * $('.currencyvalue').val());
                    }

                }


            }
        });
    });
    $('#coin').on('change', function (e) {
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + $('#coin').val() + "&tsyms=" + $('#currency').val(),
            dataType: 'json'
            ,
            success: function (response) {
                var n;
                var t;
                for (n in response) {

                    var val = response[n];// value where key is n
                    for (n in val) {

                        val = val[n];// value where key is n
                        $('.currencyvalue').val(val * $('.coinvalue').val());
                    }

                }


            }
        });
    });
    $('#currency').on('change', function (e) {
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + $('#coin').val() + "&tsyms=" + $('#currency').val(),
            dataType: 'json'
            ,
            success: function (response) {
                var n;
                var t;
                for (n in response) {

                    var val = response[n];// value where key is n
                    for (n in val) {

                        val = val[n];// value where key is n
                        $('.currencyvalue').val(val * $('.coinvalue').val());
                    }

                }


            }
        });
    });


})(jQuery);