// Preloader js    
$(window).on('load', function () {
  $('.preloader').fadeOut(100);
});

(function ($) {
  'use strict';

  if (document.querySelector("#openModal")) {
    var snipcartButton = document.querySelector("#snipcartButton");

    $(".note").on('keyup', function(e) {
      snipcartButton.setAttribute("data-item-custom3-value", e.target.value);
    });

    $(".card").on("click", function(e) {
      var note = $(e.currentTarget).find(".note");
      var val = $(e.currentTarget).find("input[type=radio]").prop("value");
      if (note.is(":hidden") || val === "None") {
        // check its not already displayed or if none we want to slide down any that are
        $(".note").slideUp();
        note.slideDown();
      }

      $(e.currentTarget).find("input[type=radio]").prop("checked", true);
      snipcartButton.setAttribute("data-item-custom2-value", val);
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

  // create your own boxes
  var resetSelection = function() {
    var snipcartButton = document.getElementById("snipcartButton");
    
    // first three customs are Note, Card choice, Card Text.
    var i = 4;
    while (snipcartButton.hasAttribute("data-item-custom" + i + "-name")) {
      if (i <= 5) {
        // start at 4, first two don't have a "None" option (minimum of two per order) so just remove the attribute
        snipcartButton.removeAttribute("data-item-custom" + i + "-value");
      } else {
        snipcartButton.setAttribute("data-item-custom" + i + "-value", "None");
      }

      i++;
    }
    
    // first three options are Note, Card choice, Card Text.  
    var i = 4;
    $("#selectedProductsRow").children().each((_, em) => {
      var options = snipcartButton.getAttribute("data-item-custom" + i + "-options");
      var selectedOption = em.getAttribute("data-option-name");

      if (options.indexOf(selectedOption) <= -1) {
        alert("Invalid option chosen");
      } else {
        snipcartButton.setAttribute("data-item-custom" + i + "-value", em.getAttribute("data-option-name"));
      }

      i++;
    });
  }

  if (document.querySelector("#createYourOwn")) {
    var miniHandler = function() {
      var mini = $(this);
      if ($("#selectedProductsRow").children().length === 1) {
        $("#selectedProducts").slideUp(function () {
          mini.remove();
        });
      } else {
        mini.remove();
      }
    }

    $(".product").on('click', function() {
      if ($("#selectedProductsRow").children().length < 5) {
        var mini = $(this).find('.mini').clone();
        mini.on('click', miniHandler);

        mini.removeClass("d-none");
        $("#selectedProductsRow").append(mini);
        $("#selectedProducts").slideDown();
      } else {
        alert('Maximum of 5 products');
      }
      
      resetSelection();
    });

    document.getElementById("openModal").onclick = function() {
      // only allow adding with a minimum of 2 products
      if ($("#selectedProductsRow").children().length >= 2) {
        $("#modalSelector").modal({});
      } else {
        alert('Minimum of 2 products');
      }
      
      resetSelection();
    };
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