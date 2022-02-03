var analyticsCode = `
<script src="https://www.googletagmanager.com/gtag/js?id=gatoken"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'gatoken');
</script>
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
   fbq('init', 'pixeltoken'); 
  fbq('track', 'PageView');
  </script>
  <noscript>
   <img height="1" width="1" 
  src="https://www.facebook.com/tr?id=pixeltoken&ev=PageView
  &noscript=1"/>
  </noscript>
`;

// Preloader js
$(window).on('load', function () {
  $('.preloader').fadeOut(100);
});

(function ($) {
  'use strict';
  
  var searchMethod = function(itemSelector) {
    var search = $("#productSearch").val().toLowerCase();
    var searchEmpty = search.replace(/\s/, "") === "";
    var category = $("#productCategory option:selected").val().toLowerCase();
    var categoryEmpty = category === "";

    if (searchEmpty && categoryEmpty) {
      $(itemSelector).show();
    } else {
      $(itemSelector).each((i, item) => {
        var desc = $(item).find("input.description").val().toLowerCase();
        var cats = $(item).find("input.categories").val().toLowerCase();

        if (desc.indexOf(search) > -1 && cats.indexOf(category) > -1) {
          $(item).show();
        } else if (desc.indexOf(search) > -1 && categoryEmpty) {
          $(item).show();
        } else if (searchEmpty && cats.indexOf(category) > -1) {
          $(item).show();
        } else {
          $(item).hide();
        }
      });
    }
  };

  if ($("#productSearch").length > 0) {
    $("#productSearch").on('input', () => searchMethod(".product-list"));
    $("#productCategory").on('change', () => searchMethod(".product-list"));
  }

  if ($("#alcoholAgeCheck").length > 0 && $("#createYourOwn").length === 0) {
    if (Cookies.get("age-verified") === undefined || Cookies.get("age-verified") !== "pass") {
      $("#alcoholModalConfirm").on("click", function(e) {
        Cookies.set("age-verified", "pass");
        $("#alcoholAgeCheck").modal("hide");
      });

      $("#alcoholModalReject").on("click", function(e) {
        window.history.back();
      });

      $("#alcoholAgeCheck").modal({
        backdrop: "static",
        keyboard: false,
        focus: true,
        show: true,
      });
    }
  }

  if (document.querySelector("#openModal")) {
    var snipcartButton = document.querySelector("#snipcartButton");

    $("#btnSkip").on("click", () => {
      // clear card text and choice
      snipcartButton.setAttribute("data-item-custom2-value", "None");
      snipcartButton.setAttribute("data-item-custom3-value", "");
      snipcartButton.click()
    });

    $(".note").on('keyup', function(e) {
      // set the text on the note for the card
      snipcartButton.setAttribute("data-item-custom3-value", e.target.value);
    });

    $(".card").on("click", function(e) {
      var note = $(e.currentTarget).parent().find(".note");
      var val = $(e.currentTarget).find("input[type=radio]").prop("value");
      if (note.is(":hidden") || val === "None") {
        // check its not already displayed or if none we want to slide down any that are
        $(".note").slideUp();
        note.slideDown();

        if ($(e.currentTarget).parent().find("textarea").length > 0) {
          // set the text on the note for the card
          snipcartButton.setAttribute("data-item-custom3-value", $(e.currentTarget).parent().find("textarea").val());
        } else {
          // clear the text on the note for the card
          snipcartButton.setAttribute("data-item-custom3-value", "");
        }
      }

      $(e.currentTarget).find("input[type=radio]").prop("checked", true);

      // set the selected card in the button
      snipcartButton.setAttribute("data-item-custom2-value", val);
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
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

    $("#reviewYourBox").on('click', function() {
      $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    // set all the options to default
    // set alcohol hidden
    var alcoholCustomOptionIndex = 4; // configured in the upsell-modal.html
    snipcartButton.setAttribute("data-item-custom" + alcoholCustomOptionIndex + "-value", "false");

    // first four customs are Note, Card choice, Card Text, alcohol.
    var i = 5;
    while (snipcartButton.hasAttribute("data-item-custom" + i + "-name")) {
      if (i <= 6) {
        // start at 5, first two don't have a "None" option (minimum of two per order) so just remove the attribute
        snipcartButton.removeAttribute("data-item-custom" + i + "-value");
      } else {
        snipcartButton.setAttribute("data-item-custom" + i + "-value", "None");
      }

      i++;
    }

    // work through the choices in the #selectedProductsRow and set them in the snipcart button
    // first four options are Note, Card choice, Card Text, alcohol
    var i = 5;
    var startingCost = parseInt(snipcartButton.getAttribute("data-item-price").replace(/\./, '')); // get the starting price from the snipcart button but remove the . so its in pence
    var totalCost = startingCost;
    $("#selectedProductsRow .mini").each((_, em) => {
      var options = snipcartButton.getAttribute("data-item-custom" + i + "-options");
      var selectedOption = em.getAttribute("data-option-name");
      var price = parseInt(em.getAttribute("data-option-price"));
      totalCost += price;

      if (options.indexOf(selectedOption) <= -1) {
        alert("Invalid option chosen");
      } else {
        snipcartButton.setAttribute("data-item-custom" + i + "-value", em.getAttribute("data-option-name"));
        if (em.getAttribute("data-option-alcohol") === "true") {
          // set alcohol hidden
          snipcartButton.setAttribute("data-item-custom" + alcoholCustomOptionIndex + "-value", "true");
        }
      }

      i++;
    });

    $(".total").text("£" + (totalCost/100.0).toFixed(2).toString());
    $("#liveToast").toast("show");
  }

  if (document.querySelector("#createYourOwn")) {
    $("#liveToast").toast();

    // calculate the maximum number of options
    // the options are held against the snipcart button and stored in the options
    var snipcartButton = document.getElementById("snipcartButton");
    var maxSelection = 0;
    var maxSelectionStartingPoint = 5; // first four options are Note, Card choice, Card Text and alcohol hidden option
    while (snipcartButton.hasAttribute("data-item-custom" + maxSelectionStartingPoint + "-name")) {
      maxSelection++;
      maxSelectionStartingPoint++;
    }

    var removeProduct = function() {
      var mini = $(this);
      if ($("#selectedProductsRow .mini").length === 1) {
        $("#selectedProducts").slideUp(function () {
          mini.remove();
          $("#liveToast").toast("hide");
        });
      } else {
        mini.remove();
      }

      resetSelection();
    }

    var addProduct = function(mini) {
      $("#selectedProductsRow").append(mini);
      $("#selectedProducts").slideDown();

      if ($("#selectedProductsRow .mini").length === 1) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }

      resetSelection();
    }

    var productClick = function(mini) {
      mini.on('click', removeProduct);
      mini.removeClass("d-none");

      if (mini.attr("data-option-alcohol") === "true" && Cookies.get("age-verified") !== "pass") {
        $("#alcoholModalConfirm").unbind("click");
        $("#alcoholModalReject").unbind("click");

        $("#alcoholModalConfirm").on("click", function(e) {
          Cookies.set("age-verified", "pass");
          $("#alcoholAgeCheck").modal("hide");
          addProduct(mini);
        });

        $("#alcoholModalReject").on("click", function(e) {
          $("#alcoholAgeCheck").modal("hide");
        });

        $("#alcoholAgeCheck").modal({
          backdrop: "static",
          keyboard: false,
          focus: true,
          show: true,
        });
      } else {
        addProduct(mini);
      }
    }

    $(".create-your-own-add").on('click', function() {
      if ($("#selectedProductsRow .mini").length < maxSelection) {
        productClick($(this).parent().parent().find('.mini').clone());
      } else {
        alert("Maximum of " + maxSelection + " products");
      }
    });

    $(".product").on('click', function() {
      if ($("#selectedProductsRow .mini").length < maxSelection) {
        productClick($(this).find('.mini').clone());
      } else {
        alert("Maximum of " + maxSelection + " products");
      }
    });

    document.getElementById("openModal").onclick = function() {
      // only allow adding with a minimum of 2 products
      if ($("#selectedProductsRow .mini").length >= 2) {
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