(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // // Portfolio isotope and filter
    // var portfolioIsotope = $('.portfolio-container').isotope({
    //     itemSelector: '.portfolio-item',
    //     layoutMode: 'fitRows'
    // });
    // $('#portfolio-flters li').on('click', function () {
    //     $("#portfolio-flters li").removeClass('active');
    //     $(this).addClass('active');

    //     portfolioIsotope.isotope({filter: $(this).data('filter')});
    // });
    // Portfolio isotope and filter
var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows'
});

// Function to filter the Isotope based on the active filter
function filterIsotopeByActive() {
    var activeFilter = $("#portfolio-flters li.active").data('filter');
    portfolioIsotope.isotope({ filter: activeFilter });
}

// Check if there is an active filter on page load and filter the Isotope accordingly
$(document).ready(function() {
    if ($("#portfolio-flters li.active").length > 0) {
        filterIsotopeByActive();
    }
});

// Click event handler for the filter items
$('#portfolio-flters li').on('click', function () {
    $("#portfolio-flters li").removeClass('active');
    $(this).addClass('active');

    portfolioIsotope.isotope({ filter: $(this).data('filter') });
});



    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

    
})(jQuery);




// main.js
// Initialize EmailJS with your user ID
// require('dotenv').config()
// const emailjs = require('emailjs')

// const handleSubmit = (formData) => {



// emailjs.send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, formData,{
//     from_name:,
//     to_name:,
//     from_email:,
//     to_email:,
//     message:,
// },process.env.EMAILJS_PUBLIC_KEY).then(()=>window.alert('Success!'), (err)=>{
//     window.alert('Failed!')
// })
// }
