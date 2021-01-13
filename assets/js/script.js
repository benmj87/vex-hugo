// Preloader js    
$(window).on('load', function () {
  $('.preloader').fadeOut(100);
});

(function ($) {
  'use strict';

  if (document.querySelector("#openModal")) {
    var snipcartButton = document.querySelector("#snipcartButton");

    $(".card").on("click", function(e) {
      $(e.currentTarget).find("input[type=radio]").prop("checked", true);
      snipcartButton.setAttribute("data-item-custom2-value", $(e.currentTarget).find("input[type=radio]").prop("value"));
    });

    // Get the button that opens the modal
    var btn = document.getElementById("openModal");

    snipcartButton.addEventListener('click', () => {
      $("#modalSelector").modal('hide');
    });

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      $("#modalSelector").modal({});
    }  
  }
  
  // product Slider
  $('.product-image-slider').slick({
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    customPaging: function (slider, i) {
      var image = $(slider.$slides[i]).data('image');
      return '<img class="img-fluid" src="' + image + '" alt="product-image">';
    }
  });

  // Product slider
  $('.product-slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

})(jQuery);