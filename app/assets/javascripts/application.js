// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require bootstrap-sprockets
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require jquery-ui
//= require card
//= require bootstrap
//= require moment
//= require bootstrap-datetimepicker
//= require bootstrap-select
//= require bootstrap.min
//= require cocoon
//= require_tree .
//= require turbolinks


$(document).on('turbolinks:load', function(){
  $('#product-modal').on('shown.bs.modal', function() {
    shipping();
    //not recognized for some reason
  });

  shipping();

  $('#carouselExampleIndicators').carousel();

  $('#cake-modal').on('shown.bs.modal', function() {
    cartFunctions();
    prepareCakeModal();
    updateCakeModal();
  });

  cartFunctions(); //run functions for non-cakes

  $('.spinner').hide();
  $('.shipping-spinner').hide();
  // $('.shipping-text-wrapper').show();
  $('.selectpicker').selectpicker({
    size: 'false'
  });

  localStorage.setItem("lowPrice", 0);
  localStorage.setItem("highPrice", 400);
  $(".dropdown-toggle").dropdown();

  $('.dropdown-button').mouseenter(function(){
    $(this).parent().addClass("open");
  });



  $('.dropdown-menu').mouseenter(function(){
    $(this).prev(".dropdown-toggle").parent().addClass("open");
  });



  $('#search-form').on('keyup', function() {
      $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags }, function() {
      })
      .success( function (data) {
        products = $(data).find('#productss')
        $('#productss').html(products);
        $('.spinner').hide();
      });

      // var pattern = $(this).val();
      // $('.searchable-container .items').hide();
      // $('.searchable-container .items').filter(function() {
      //     return $(this).text().match(new RegExp(pattern, 'i'));
      // }).show();
  });

  function updateOrderItemCheckout(checkoutQuantityVar){
    var checkoutQuantity = checkoutQuantityVar.val();
    var order_item_idVar=$('.order_item.id');
    debugger;
    var orderItemId=checkoutQuantityVar.closest("input", order_item_idVar).val();
    $.ajax({
        url: '/order_items/'+orderItemId,
        type: 'put',
        dataType: 'json',
        data: {order_item: {quantity: checkoutQuantity}},
        success: function(data) {
                   checkoutQuantity.blur();
                   $('#order-total').html($('#order-total').attr("data-href"));
                 }
    });
  };

  $('.checkout-quantity').on('change', function() {
    updateOrderItemCheckout($(this));
  });
  // else if (quantity==0 && quantityElement.selector===".checkout-quantity") {
  //   $(this).val($('.order_item_quantity').val());
  // }
  $('.checkout-plus-quantity').on('click',function(){
    updateOrderItemCheckout($(this).attr("data-href"));
  });

  $('.checkout-minus-quantity').on('click',function(){
    updateOrderItemCheckout($("."+$(this).attr("data-href")));
  });

  function cartFunctions() {
    $('.quantity').val(0);
    $('.checkout-quantity').val($('.order_item_quantity').val());

    var selectElement = $('.selectpicker').length > 0 ? $('.selectpicker') : null ;
    var quantityElement = $('.quantity').length > 0 ? $('.quantity') : $('.checkout-quantity') ;

    $('.add-cart').prop('disabled', true);

    $('.selectpicker').on('change',function(){
      if (selectCheck($(this))&&quantityCheck(quantityElement)){
        $('.add-cart').prop('disabled', false)
      }
      else {
        $('.add-cart').prop('disabled', true)
      };
    });

    function selectCheck(selectElement){
      if (selectElement.val()=="") {
        return false;
      }
      else {
        return true;
      };

    };

    quantityElement.on('input', function(){
      if (selectElement != null){
        updateButtonWithSelect(selectElement, $(this));
      }
      else {
        updateButton($(this));

      };
    });

    quantityElement.on('keyup', function() {
      checkStock($(this));
    });

    quantityElement.change(function(){
      if (selectElement != null){
        updateButtonWithSelect(selectElement, $(this));
      }
      else {
        updateButton($(this));
      };
      if ($(this).val()=="") {
        if ($(this).selector===".checkout-quantity"){
          $(this).val($('.order_item_quantity').val());
        }
        else{
          $(this).val(0);
        };
      };
      if ($(this).val()==0 && $(this).selector===".checkout-quantity") {
        $(this).val($('.order_item_quantity').val());
      };
    });

    function quantityCheck(quantityElementVar){
      if (quantityElementVar.selector===".checkout-quantity"){
        if (quantityElementVar.val()<="1") {
          return false;
        }
        else if (quantityElementVar.val()=="") {
          return false;
        }
        else {
          return true;
        };
      }
      else{
        if (quantityElementVar.val()<="0") {
          return false;
        }
        else if (quantityElementVar.val()=="") {
          return false;
        }
        else {
          return true;
        };
      }

    };



    function updateButtonWithSelect(selectElement, quantityElement){
      if (selectCheck(selectElement)&&quantityCheck(quantityElement)){
        $('.add-cart').prop('disabled', false);
      }
      else {
        $('.add-cart').prop('disabled', true);
      };
    };

    function updateButton(quantityElementVar){
      if (quantityCheck(quantityElementVar)){
        $('.add-cart').prop('disabled', false);
      }
      else {
        $('.add-cart').prop('disabled', true);
      };
    };

    $('.minus-quantity').on('click',function(){
      var checkoutQuantityElement = $(this).attr("data-href") ? $(this).attr("data-href") : null;
      quantityElement = checkoutQuantityElement ? $('.'+checkoutQuantityElement) : quantityElement;
      var quantity = parseInt(quantityElement.val());
      if (quantityElement.hasClass("checkout-quantity")){
        if (quantity > 1){
          quantityElement.val(quantity-1);
        };
      }
      else{
        if (quantity > 0){
          quantityElement.val(quantity-1);
        };
      };
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        updateButton(quantityElement);
      };
    });
    $('.plus-quantity').on('click',function(){
      debugger;
      var checkoutQuantityElement = $(this).attr("data-href") ? $(this).attr("data-href") : null;
      quantityElement = checkoutQuantityElement ? $('.'+checkoutQuantityElement) : quantityElement;
      var quantity = parseInt(quantityElement.val());
      quantityElement.val(quantity+=1);
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        checkStock(quantityElement);
      };
    });
    function checkStock(quantityElementVar){
      var quantity = parseInt(quantityElementVar.val());
      var stock = quantityElementVar.attr('data-href') ? parseInt(quantityElementVar.attr('data-href')) : null
      var productid=$('.product_id').val();
      var cartProducts=$('.cart-product-name');
      var incart=0;
      for(var i =0; i<cartProducts.length; i++){
        if ($(cartProducts[i]).attr('data-href')===productid){
          incart+=parseInt($(cartProducts[i]).next().attr('data-href'));
        };
      };
      var stockleft= stock!=null ? stock-incart : null;
      $('.cart-product-name').attr('data-href');
      var quantitySelected = parseInt(quantityElementVar.val())
      if (quantitySelected <= stockleft || stockleft==null){
        updateButton(quantityElement);
      }
      else if (quantitySelected >= stockleft){
        quantityElementVar.val(stockleft);
        $('.cart-notice').html("<span>Only " + quantityElementVar.attr('data-href') + " item(s) left in stock</span>")
      }
      else if (quantity==0 && quantityElementVar.selector===".checkout-quantity") {
        $(this).val($('.order_item_quantity').val());
      };

    };
    if ($('.order-item').length<=0){
      $('#content').html('<div class="fullscreen"><div class="container main-text-container"><div class="col-xs-12"><span class="">Your Cart is Empty</span></div><div class="col-xs-12"><button class="btn btn-lg simple-button-black"><a href="<%= request.base_url %>/categories/2/?low=0&high=400&tags%5B%5D=Bracelet&tags%5B%5D=Earring&tags%5B%5D=Necklace&tags%5B%5D=Ring" class="link_to"><span class="button-text-black">Continue Shopping</span></a></button></div></div></div>');
    };
    $('.add-cart').on('click', function () {
      var cart = $('.cart-dropdown');
      $('#cake-modal').modal("hide");

      var imgtodrag = $("#product-show-image");
      var carousel=$(".carousel-inner")

      if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
            top: carousel.offset().top,
            left: carousel.offset().left
        })
          .removeClass('product-show-image')
          .addClass('small-dragged-product-show-image')

            .appendTo($('body'))
            .animate({
            'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
        }, 1000, 'easeInOutExpo');
        imgclone.animate({
            'width': 0,
                'height': 0
        }, function () {
            $(this).detach()
        });
      }

      setTimeout(function(){
        quantityElement.val(0);
        if (selectElement != null){
          updateButtonWithSelect(selectElement, quantityElement);
        }
        else {
          updateButton(quantityElement);
        };
      },1000);
    });
  };


  $('.tab-item').on('click', function(){
    $('.tab-item').removeClass("active");
    $(this).addClass("active");
    var tabContentId = '#'+$(this).attr("id")+"-content";
    $('.content-item').removeClass("active");
    $(tabContentId).addClass("active");
  });


  $('#datetimepicker3').datetimepicker({
    format: 'LT'
  });


  var id = $("#slider-3").attr('data-href')
  $( "#slider-3" ).slider({
    range:true,
    min: (id='2' ? 5 : 0) ,
    max: (id='2' ? 400 : 50),
    values: [ (id='2' ? 5 : 0), (id='2' ? 400 : 50) ],
    slide: function( event, ui ) {
      $( "#pricer" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    },
    stop: function(event, ui) {
      $('.spinner').show();
      var tags = $('.tag-check-box:checked').map(function (){
        return this.id;
      }).get();
      tags = tags.length>0 ? tags : 0;
      var id = $("#slider-3").attr('data-href');
      var sortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : null
      var order = localStorage.getItem('order') ? localStorage.getItem('order') : null
      $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ], tags: tags, sort: sortBy, order: order  }, function() {
        localStorage.setItem("lowPrice", ui.values[ 0 ]);
        localStorage.setItem("highPrice", ui.values[ 1 ]);
      })
      .success( function (data) {
        var tagsForUrl='';
        for(var i=0; i<tags.length; i++){
          tagsForUrl+=('&tags%5B%5D='+tags[i]);
        };
        lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0
        highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400
        history.pushState({ low: lowPrice, high: highPrice, tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'low=' + lowPrice + '&high=' + highPrice + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
        products = $(data).find('#productss')
        $('#productss').html(products);
        $('.spinner').hide();
      })
    }
  });
  $( "#pricer" ).html( "$" + $( "#slider-3" ).slider( "values", 0 ) +
    " - $" + $( "#slider-3" ).slider( "values", 1 ) );

  // $('#filter-button').click(function(){
  //   $('.filter').show();
  //   var filterWidth = $('.filter').outerWidth(true);
  //   var marginLeft = parseInt($('.products-to-show').css("margin-left"));
  //   $('.products-to-show').css("margin-left", marginLeft+filterWidth+"px");
  //   $(this).hide();
  // });
  //
  // $('#close-filter-button').click(function(){
  //   $('.filter').hide();
  //   $('#filter-button').show();
  //   var filterWidth = $('.filter').outerWidth(true);
  //   var marginLeft = parseInt($('.products-to-show').css("margin-left"));
  //   $('.products-to-show').css("margin-left", marginLeft-filterWidth+"px");
  // });

  $('.inner-category').click(function(){
    localStorage.setItem("selectedSubCats []", [$(this).attr('id').capitalize]);
  });

  //make this code only run on category show page
  //todo:
  //also pagination and sorting put latest added items on homepage and search. add pagination to url
  //footer
  if (top.location.href.indexOf('/categories/2') > -1){
    // if (localStorage.getItem('selectedSubCats')){
    //   var unveiledSelectedSubCats = localStorage.getItem('selectedSubCats');
    //   if ($('#'+unveiledSelectedSubCats).length > 0){
    //     $('.tag-check-box').removeClass('active');
    //     $('#'+unveiledSelectedSubCats).addClass('active');
    //   }
    // };
    if (getParameterByName('tags%5B%5D')){

      var tagParameters = getParameterByName('tags%5B%5D');
      $('.tag-check-box').attr('checked', false);
      for (var i=0; i<tagParameters.length;i++){
        $('#'+tagParameters[i]).prop("checked", "checked");
      }
    };

    if (getParameterByName('sort')&&getParameterByName('order')){
      var sortedBy = getParameterByName('sort');
      var orderedBy = getParameterByName('order');
      $('#sort-by-dropdown:first-child').html('<span class="sort-button-text"><span class="sorted-by">'+ sortedBy + " " + orderedBy + '</span><span class="pull-right"><span class="caret sort-caret"></span></span></span>');
    };

    var minimumPrice = (getParameterByName('low') ? getParameterByName('low') : 0);
    localStorage.setItem("lowPrice", minimumPrice);
    var maximumPrice = (getParameterByName('high') ? getParameterByName('high') : 400);
    localStorage.setItem("highPrice", maximumPrice);
    $( "#slider-3" ).slider({
      range:true,
      min: 0 ,
      max: 400,
      values: [ minimumPrice, maximumPrice ]
    });
    $( "#pricer" ).html( "$" + $( "#slider-3" ).slider( "values", 0 ) +
      " - $" + $( "#slider-3" ).slider( "values", 1 ) );
  };

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    // name = name.replace(/[\[\]]/g, "\\$&");
    var matches = [];
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", 'g'),
        results = regex.exec(url);

    if (!results) return null;
    // if (!results[2]) return '';
    while (results){
      matches.push(results[2].replace(/\+/g, " "));
      results = regex.exec(url);
    };
    return matches;
    // return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  $('.sort-by-option').click(function(){
    $('.spinner').show();
    $('#sort-by-dropdown:first-child').html('<span class="sort-button-text"><span class="sorted-by">'+ $(this).text() + '</span><span class="pull-right"><span class="caret sort-caret"></span></span></span>');
    var id = $("#slider-3").attr('data-href');
    var tags = $('.tag-check-box:checked').map(function (){
      return this.id;
    }).get();
    tags = tags.length>0 ? tags : 0
    lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0
    highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400
    var sortBy = $(this).attr("id");
    var order = $(this).attr("data-href");
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("order", order);

    $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags, sort: sortBy, order: order }, function() {
    })
    .success( function (data) {
      var tagsForUrl='';
      for(var i=0; i<tags.length; i++){
        tagsForUrl+=('&tags%5B%5D='+tags[i]);
      };
      history.pushState({ low: lowPrice, high: highPrice, tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'low=' + lowPrice + '&high=' + highPrice + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
      products = $(data).find('#productss')
      $('#productss').html(products);
      $('.spinner').hide();
    });
  });
  $('.tag-check-box').click(function(){
    $('.spinner').show();
    var id = $("#slider-3").attr('data-href');
    var tags = $('.tag-check-box:checked').map(function (){
      return this.id;
    }).get();
    tags = tags.length>0 ? tags : 0
    lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0;
    highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400;
    var sortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : null
    var order = localStorage.getItem('order') ? localStorage.getItem('order') : null

    $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags, sort:sortBy, order: order }, function() {
    })
    .success( function (data) {
      var tagsForUrl='';
      for(var i=0; i<tags.length; i++){
        tagsForUrl+=('&tags%5B%5D='+tags[i]);
      };
      history.pushState({ low: lowPrice, high: highPrice, tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'low=' + lowPrice + '&high=' + highPrice + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
      products = $(data).find('#productss')
      $('#productss').html(products);
      $('.spinner').hide();
    });
  });


  function prepareCakeModal() {
    $('.cake-quantity').val(0);
    $('.add-cart').prop('disabled', true);
    $('#carouselExampleIndicators').carousel();
    $("#datetimepicker1").change(function(){
      $(this).datetimepicker('hide');
    });
    $('#datetimepicker3').datetimepicker({
      format: 'LT'
    });
  };

  function updateCakeModal() {
    var today = new Date();
    var dater = today.setDate(today.getDate() + parseInt($('#prep_time').val()));
    var date=new Date(dater);
    $('#datetimepicker1').datetimepicker({minDate : date,format: 'L'});
    if ($('.delivery-option').val()=="1"){
      $('.delivery-title').show();

    };
    $('.delivery-option').change(function(){
      if ($(this).val()=="1"){
        $('.delivery-title').show();
        $('.pickup-title').hide();
      };
      if ($(this).val()=="0"){
        $('.delivery-title').hide();
        $('.pickup-title').show();
      };
    });
  };

  function formchecker(){
    var isFormValid = true;
    $("#address-form .required").each(function(){ // Note the :text
      if ($.trim($(this).val()).length == 0){
          $(this).addClass("highlight");
          isFormValid = false;
      } else {
          $(this).removeClass("highlight");
      }
    });
    // if (!isFormValid) alert("Please fill in all the required fields (highlighted in red)");
    return isFormValid;
  };


  function updateCreditCard(){
    $('#exp-month, #exp-year').on('change', function () {
        // Set the value of a hidden input field for Card
        if ($('#exp-month').val().length<=1){
          var expiryMonth= $('#exp-month').val();
          expiryMonth = '0' + expiryMonth;
        };

        $('#expiry').val(expiryMonth + '/' + $('#exp-year').val());
        // Trigger the "change" event manually
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', false, true);
        document.getElementById('expiry').dispatchEvent(evt);
    });
    var card = new Card({
        // a selector or DOM element for the form where users will
        // be entering their information
        form: '#payment-form', // *required*
        // a selector or DOM element for the container
        // where you want the card to appear
        container: '.card-wrapper', // *required*

        formSelectors: {
            numberInput: 'input#credit-card-number', // optional — default input[name="number"]
            expiryInput: '#expiry', // optional — default input[name="expiry"]
            cvcInput: 'input#security-code', // optional — default input[name="cvc"]
            nameInput: 'input#purchaser_name' // optional - defaults input[name="name"]
        },

        // width: 100, // optional — default 350px
        formatting: true, // optional - default true

        // Strings for translation - optional
        messages: {
            validDate: 'valid\ndate', // optional - default 'valid\nthru'
            monthYear: 'mm/yyyy', // optional - default 'month/year'
        },

        // Default placeholders for rendered fields - optional
        placeholders: {
            number: '•••• •••• •••• ••••',
            name: 'Full Name',
            expiry: '••/••',
            cvc: '•••'
        },

        masks: {
            cardNumber: '•' // optional - mask card number
        },

        // if true, will log helpful messages for setting up Card
        debug: false // optional - default false
    });
  };


  function shipping() {
    $('#shipping').click(function(event){
      event.preventDefault();
      if (formchecker()){
        var position = $('.shipping-div').offset();
        var shippingHeight = $('.shipping-div').outerHeight();
        var shippingWidth = $('.shipping-div').outerWidth();
        $('.shipping-spinner').show();

        $('.shipping-spinner').css('height',shippingHeight);
        $('.shipping-spinner').css('width',shippingWidth);
        $('.shipping-spinner').css(position);
        // $("#product-modal").modal("hide");
        $('.shipping-text-wrapper').show();
        var order_id= $("#shipping").attr('data-href');
        var name = $('input#name').val();
        var line1 = $('input#line1').val();
        var line2 = $('input#line2').val();
        var city = $('input#city').val();
        var state = $('input#state').val();
        var zip = $('input#zip').val();
        var country = $('#country').val();
        $("#address-form").animate({
          left: "-100%"
        }, 1000);
        ajaxCall3();
        $.ajax({
          type: "POST",
          url: "/addresses",
          data: { address: { name: name, line1:line1, line2:line2, city:city, state:state, zip:zip, country:country } },
          success : function(html,status){
            ajaxCall2();
          }
        });
      }
      else return;
    });

    $('#final-checkout').click(function(){
      var id = $("#final-checkout").attr('data-href');
      $.get("/orders/" + id + "/checkout", function() {
      })
      .success( function (data) {
        var content = $(data).find('#content');
        $('#content').html(content);
        $('.spinner').hide();
      });
    });


    $('#paymentt').click(function(){
      $.get("/orders/new", function() {
      })
      .success( function (data) {
        products = $(data).find('#payment-form');
        $('.shipping-content').html(products);
        updateCreditCard();
        $('.spinner').hide();
      });
    });
    function ajaxCall2() {
      var id = $("#shipping").attr('data-href');
      $.get("/orders/"+ id + "/shipping", function() {
      })
      .success(function (data) {
        var shippingData= $(data).find('.shipping-content')
        // $('#total-price').html('<%=number_to_currency@shipping%>');
        $('#order-summary-content').html(shippingData);
        // $("#product-modal").modal("show");
        $('.shipping-spinner').hide();
        $('.shipping-text-wrapper').hide();
        $("#address-form :input").prop("disabled", false);
      });
    };
    function ajaxCall3(){
      $.get("/orders/new", function() {
      })
      .success( function (data) {
        products = $(data).find('#payment-form');
        $('#address-form').html(products);
        $("#address-form :input").prop("disabled", true);
        $("#address-form").animate({
          left: "0%"
        }, 1000);
        updateCreditCard();
        $('.spinner').hide();
      });
    }
  };





  $(document).on('change','#pictureInput',function(event){
    var files = event.target.files;
    var image = files[0]
    var that = $(this)
    var reader = new FileReader();
    reader.onload = function(file) {
      var img = new Image();
      img.src = file.target.result;
      img.class="preview-img";
      that.parent().parent().parent().children('.row').children('#target').html(img);
    }
    reader.readAsDataURL(image);
  });

  var show_error, stripeResponseHandler;
  $("#new_order").submit(function (event) {
    var $form;
    $form = $(this);
    $form.find("input[type=submit]").prop("disabled", true);
    Stripe.card.createToken($form, stripeResponseHandler);
    return false;
  });


});
