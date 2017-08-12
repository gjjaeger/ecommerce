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


//= require card
//= require bootstrap
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require jquery-ui
//= require moment
//= require bootstrap-datetimepicker
//= require bootstrap-select
//= require bootstrap.min
//= require cocoon
//= require_tree .
//= require turbolinks

$(document).on('turbolinks:load', function(){

  var dropdownSlider = $( "#dropdown-slider" );
  $(window).resize(function(){
    sizeChecker();
  });

  var bigPicture=$('.product-show-image').innerHeight();
  $('.preview-images').innerHeight(bigPicture);

  sizeChecker();
  function sizeChecker(){
    var windowWidth = $(window).width();
    var bigPicture=$('.product-show-image').innerHeight();
    $('.preview-images').innerHeight(bigPicture);
    var sidebar = $('.sidebar')
    if (windowWidth >= 980){
      $("#dropdown-price-toggle-button").hide();
      $("#dropdown-categories-toggle-button").hide();
      $('.sidebar').show();
    }
    else {
      $('.sidebar').hide();
      $("#dropdown-price-toggle-button" ).show();
      $("#dropdown-categories-toggle-button").show();
    };
    filterFunctions();
  }

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
  $('.circle-spinner').hide();
  $('.circle-spinner2').hide();
  // $('.shipping-text-wrapper').show();
  $('.selectpicker').selectpicker({
    size: 'false'
  });

  localStorage.setItem("lowPrice", 0);
  localStorage.setItem("highPrice", 400);
  $(".dropdown-toggle").dropdown();
  $(".dropdown-toggle-cart").dropdown();

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

  function orderItemCheckout(){
    function updateOrderItemCheckout(checkoutQuantityVar){
      var checkoutQuantity = checkoutQuantityVar.val();
      var orderItemId=checkoutQuantityVar.siblings('.order_item_id').val();
      $.ajax({
          url: '/order_items/'+orderItemId,
          type: 'put',
          dataType: 'json',
          data: {order_item: {quantity: checkoutQuantity}},
          success: function(data) {
            checkoutQuantityVar.blur();
            $('.total_price_per_product.'+orderItemId).load(location.href + ' .total_price_per_product.'+orderItemId);
            $('.sub-total-number').load(location.href + ' .sub-total-number');
            $('#order-total').load(location.href + ' #order-total');
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
      updateOrderItemCheckout($("."+$(this).attr("data-href")));
    });

    $('.checkout-minus-quantity').on('click',function(){
      updateOrderItemCheckout($("."+$(this).attr("data-href")));
    });
  };

  orderItemCheckout();

  function cartFunctions() {

    $('.delete_order_item').bind('ajax:success', function() {
      $('.dropdown-button-container').load(location.href + ' #dropdown-cart-button', function(){
        $(".dropdown-toggle-cart").dropdown();
        $('#dropdown-cart-button').addClass("open");
      });
    });
    // $('.quantity').val(0);
    var selectElement = $('.selectpicker').length > 0 ? $('.selectpicker') : null ;
    var quantityElement = $('.quantity').length > 0 ? $('.quantity') : $('.checkout-quantity') ;

    // $('.add-cart').prop('disabled', true);

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
        if ($(this).hasClass("checkout-quantity")){
          $(this).val($('.order_item_quantity').val());
        }
        else{
          $(this).val(0);
        };
      };
      if ($(this).val()==0 && $(this).hasClass("checkout-quantity")) {
        $(this).val($('.order_item_quantity').val());
      };
    });

    function quantityCheck(quantityElementVar){
      if (quantityElementVar.hasClass("checkout-quantity")){
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
      // else{
      //   if (quantityElementVar.val()<="0") {
      //     return false;
      //   }
      //   else if (quantityElementVar.val()=="") {
      //     return false;
      //   }
      //   else {
      //     return true;
      //   };
      // }

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
      // if (quantityCheck(quantityElementVar)){
      //   debugger;
      //   $('.add-cart').prop('disabled', false);
      // }
      // else {
      //   $('.add-cart').prop('disabled', true);
      // };
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
      var quantitySelected = parseInt(quantityElementVar.val());
      if (quantitySelected <= stockleft || stockleft==null){
        updateButton(quantityElement);
      }
      else if (quantitySelected >= stockleft && quantityElementVar.hasClass("checkout-quantity")){
        quantityElementVar.val(stockleft);
        quantityElementVar.siblings('.cart-notice').html("<span class='stock-notice'>Only " + quantityElementVar.attr('data-href') + " item(s) left in stock</span>");
      }
      else if (quantitySelected==0 && quantityElementVar.hasClass("checkout-quantity")) {
        $(this).val($('.order_item_quantity').val());
      }
      else if (quantitySelected >= stockleft){
        // quantityElementVar.val(stockleft);
        quantityElementVar.siblings('.cart-notice').html("<span class='stock-notice'>Only " + quantityElementVar.attr('data-href') + " item(s) left in stock</span>")
        return false;
      };

    };
    $('.add-cart').on('click', function (event) {
        if (checkStock(quantityElement)===false){
          event.preventDefault();
        }
      // $('#dropdown-toggle-button').removeClass("open")
    });
  };

  $('.preview-product-show-image').on('click', function(){
    $('.preview-product-show-image').removeClass("active");
    $(this).addClass("active");
  });

  filterFunctions();



  function filterFunctions(){
    debugger;
    if (localStorage.getItem("currency")!=null) {
      localStorage.setItem("currency", "JPY");
    };
    $('.closebtn').on('click',function(){
      $(".dropdown-currency-menu").width(0);
      $("body").css('margin-left','0px');
    });

    $('.currency-dropdown-button').on('click', function(){
      $(".dropdown-currency-menu").width(100);
      $("body").css('margin-left','100px');;
    });

    $('.currency').on('click',function(){
      $(".dropdown-currency-menu").width(0);
      $("body").css('margin-left','0px');
      var newCurrency=$(this).attr('data-href');
      $.ajax({
        url: "/update_currency",
        data: {currency: newCurrency}
      })
      .done(function(data){
        localStorage.setItem("currency", newCurrency);
        $('#navbar').load(location.href + ' #navbar');
        $('.yield-container').load(location.href + ' .yield-container', function(){
          shipping();
          cartFunctions();
          $(".dropdown-toggle-cart").dropdown();
          filterFunctions();
        });

      });
    });

    $('.tab-item').on('click', function(){
      $('.tab-item').removeClass("active");
      $(this).addClass("active");
      if ($(this).attr("id").indexOf("small")>=0){
        $('#'+$(this).attr("id").substring($(this).attr("id").indexOf("-")+1)).addClass("active");
      }
      else{
        $('#small-'+$(this).attr("id")).addClass("active");
      };
      var tabContentId = '#'+$(this).attr("id")+"-content";
      if (tabContentId.indexOf("small")>=0){
        var secondtabContentId = '#'+tabContentId.substring($(this).attr("id").indexOf("-")+2);
      }
      else {
        var secondtabContentId = '#small-'+$(this).attr("id")+"-content";
      };
      $('.content-item').removeClass("active");
      $(tabContentId).addClass("active");
      $(secondtabContentId).addClass("active");
    });

    var sliderElement= $( "#slider-3" ).is(":visible") ? $( "#slider-3" ) : $( "#dropdown-slider" );
    var pricerElement= $( "#pricer" ).is(":visible") ? $( "#pricer" ) : $("#dropdown-pricer");
    var pricerElementSelector= $( "#pricer" ).is(":visible") ? " #pricer" : " #dropdown-pricer";
    localStorage.setItem('currency', pricerElement.attr('data-href'));
    var categoryElement= $( "#pricer" ).is(":visible") ? $( "#pricer" ) : $("#dropdown-categories-toggle-button");
    var id = sliderElement.attr('data-href');
    var tagCheckBox = $('.tag-check-box').is(":visible") ? $('.tag-check-box') : $('.dropdown-tag-check-box');
    var minRange= 0;
    var maxRange = 400;
    var currency = localStorage.getItem('currency');
    var currentPricerText = pricerElement.text()
    var lowPriceText = currentPricerText.substring(0,currentPricerText.indexOf("-"));
    var currencySymbol = lowPriceText.match("[^0-9]");
    localStorage.setItem('currencySymbol',currencySymbol);
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    sliderElement.slider({
      range:true,
      min: minRange,
      max: maxRange,
      values: [ 0, 400 ],
      slide: function( event, ui ) {
        var currentPricerText = pricerElement.text()
        var lowPriceText = currentPricerText.substring(0,currentPricerText.indexOf("-"));
        var highPriceText = currentPricerText.substring(currentPricerText.indexOf("-")+1);
        var lastLowPriceCurrency = lowPriceText.replace(/[^0-9.]/g, '');
        lastLowPriceCurrency=parseInt(lastLowPriceCurrency) != 0 ? parseInt(lastLowPriceCurrency) : 1
        var lastHighPriceCurrency = parseInt(highPriceText.replace(/[^0-9.]/g, ''));
        var lastUI0 = localStorage.getItem("sliderlowPrice") != 0 ? localStorage.getItem("sliderlowPrice") : 1 ;
        var lastUI1 = localStorage.getItem("sliderhighPrice");
        var newLowPriceCurrency=parseInt(lastLowPriceCurrency)/lastUI0*ui.values[0].toFixed(0);
        var newHighPriceCurrency=parseInt(lastHighPriceCurrency)/lastUI1*ui.values[1].toFixed(0);
        newLowPriceCurrency=numberWithCommas(Math.floor(newLowPriceCurrency));
        newHighPriceCurrency=numberWithCommas(Math.ceil(newHighPriceCurrency));
        pricerElement.html('<span class=small-text>'+localStorage.getItem('currencySymbol')+newLowPriceCurrency+ " - "+localStorage.getItem('currencySymbol')+newHighPriceCurrency+'</span>');
        localStorage.setItem("sliderlowPrice", ui.values[0]);
        localStorage.setItem("sliderhighPrice", ui.values[1]);
      },
      stop: function(event, ui) {
        $('.spinner').show();
        placedivoverdiv('.products-to-show','.spinner');

        var pagenumber= 1 ;
        tags = checkedTagBoxes().length>0 ? checkedTagBoxes() : 0;
        var id = sliderElement.attr('data-href');
        var sortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : null;
        var order = localStorage.getItem('order') ? localStorage.getItem('order') : null;
        localStorage.setItem('currency', pricerElement.attr('data-href'));
        var currency = localStorage.getItem('currency');
        $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ], currency:currency, page: pagenumber, tags: tags, sort: sortBy, order: order  }, function() {
          localStorage.setItem("lowPrice", ui.values[ 0 ]);
          localStorage.setItem("highPrice", ui.values[ 1 ]);
        })
        .success( function (data) {
          var tagsForUrl='';
          for(var i=0; i<tags.length; i++){
            tagsForUrl+=('&tags%5B%5D='+tags[i]);
          };
          lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0;
          highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400;
          currency = localStorage.getItem('currency');
          history.pushState({ currency: currency, low: lowPrice, high: highPrice, page: pagenumber,tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'page='+ pagenumber + '&low=' + lowPrice + '&high=' + highPrice + '&currency=' + currency + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
          products = $(data).find('#productss');
          $('#productss').html(products);
          $('.pagination-links').html($(data).find('.pagination-links'));
          $('.spinner').hide();
          pricerElement.load(location.href + pricerElementSelector);

        })
      }
    });

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

    websiteLoad();
    function websiteLoad(){
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
          $('.dropdown-tag-check-box').attr('checked', false);


          for (var i=0; i<tagParameters.length;i++){
            $('.dropdown-tag-check-box#'+tagParameters[i]).prop("checked", "checked");
            $('.tag-check-box#'+tagParameters[i]).prop("checked", "checked");
          };

        };

        if (getParameterByName('sort')&&getParameterByName('order')){
          var sortedBy = getParameterByName('sort');
          var orderedBy = getParameterByName('order');
          if (sortedBy[0] === "price" && orderedBy[0] === "ascending"){
            var sortbytext = "$-$$$";
          }
          else if (sortedBy[0] === "price" && orderedBy[0] === "descending"){
            var sortbytext = "$$$-$";
          }
          else if (sortedBy[0] === "newness" && orderedBy[0] === "ascending"){
            var sortbytext = "newest";
          };
          $('#sort-by-dropdown:first-child').html('<span class="sort-button-text"><span class="sorted-by small-text">'+ sortbytext + '</span><span class="pull-right"><i class="hi hi-angle-down sort-caret"></i></span></span>');
        };

        var minimumPrice = (getParameterByName('low') ? getParameterByName('low') : 0);
        localStorage.setItem("lowPrice", minimumPrice);
        var maximumPrice = (getParameterByName('high') ? getParameterByName('high') : 400);
        localStorage.setItem("highPrice", maximumPrice);
        var currency = localStorage.getItem('currency');
        localStorage.setItem("sliderlowPrice", localStorage.getItem('lowPrice'));
        localStorage.setItem("sliderhighPrice", localStorage.getItem('highPrice'));
        //infinite loop
        while (localStorage.getItem('refresh_count')<1){
          debugger;
          localStorage.setItem('refresh_count',1);
          location.reload();
        };

        sliderElement.slider({
          range:true,
          min: 0 ,
          max: 400,
          values: [ minimumPrice, maximumPrice ]
        });
      };
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
      placedivoverdiv('.products-to-show','.spinner');
      $('#sort-by-dropdown:first-child').html('<span class="sort-button-text"><span class="sorted-by small-text">'+ $(this).text() + '</span><span class="pull-right"><i class="hi hi-angle-down sort-caret"></i></span></span>');
      var id = sliderElement.attr('data-href');

      tags = checkedTagBoxes().length>0 ? checkedTagBoxes() : 0
      lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0;
      highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400;
      currency = localStorage.getItem('currency');
      var pagenumber= 1 ;
      var sortBy = $(this).attr("id");
      var order = $(this).attr("data-href");
      localStorage.setItem("sortBy", sortBy);
      localStorage.setItem("order", order);

      $.get("/categories/"+ id, {page: pagenumber, currency: currency, low: lowPrice, high: highPrice,tags: tags, sort: sortBy, order: order }, function() {
      })
      .success( function (data) {
        var tagsForUrl='';
        for(var i=0; i<tags.length; i++){
          tagsForUrl+=('&tags%5B%5D='+tags[i]);
        };
        history.pushState({ page:pagenumber, currency: currency, low: lowPrice, high: highPrice, tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'page='+pagenumber+'&currency=' + currency + '&low=' + lowPrice + '&high=' + highPrice + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
        products = $(data).find('#productss')
        $('#productss').html(products);
        $('.pagination-links').html($(data).find('.pagination-links'));
        $('.spinner').hide();
      });
    });

    var tagCheckBox = $('.tag-check-box').is(":visible") ? $('.tag-check-box') : $('.dropdown-tag-check-box');

    tagCheckBox.click(function(){
      placedivoverdiv('.products-to-show','.spinner');
      var id = sliderElement.attr('data-href');
      if ($(this).hasClass('tag-check-box')){
        var tags = $('.tag-check-box:checked').map(function (){
          return this.id;
        }).get();
      };
      if ($(this).hasClass('dropdown-tag-check-box')) {
        var tags = $('.dropdown-tag-check-box:checked').map(function (){
          return this.id;
        }).get();
      };
      tags = tags.length>0 ? tags : 0;
      for (var i=0; i<tags.length;i++){
        $('.dropdown-tag-check-box#'+tags[i]).prop("checked", "checked");
        $('.tag-check-box#'+tags[i]).prop("checked", "checked");
      };
      lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0;
      highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400;
      currency = localStorage.getItem('currency');
      var sortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : null;
      var order = localStorage.getItem('order') ? localStorage.getItem('order') : null;
      var pagenumber=1 ;

      $.get("/categories/"+ id, {page: pagenumber,currency: currency, low: lowPrice, high: highPrice ,tags: tags, sort:sortBy, order: order }, function() {
      })
      .success( function (data) {
        var tagsForUrl='';
        for(var i=0; i<tags.length; i++){
          tagsForUrl+=('&tags%5B%5D='+tags[i]);
        };
        history.pushState({ page: pagenumber,currency: currency, low: lowPrice, high: highPrice, tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'page=' + pagenumber + '&currency=' + currency+ '&low=' + lowPrice + '&high=' + highPrice + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
        products = $(data).find('#productss')
        $('#productss').html(products);
        $('.pagination-links').html($(data).find('.pagination-links'));
        $('.spinner').hide();
      });
    });
  };



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

  $('.currency').on('click',function(){
    $(".dropdown-currency-menu").width(0);
    $("body").css('margin-left','0px');
    var newCurrency=$(this).attr('data-href');
    $.ajax({
      url: "/update_currency",
      data: {currency: newCurrency}
    })
    .done(function(data){
      localStorage.setItem("currency", newCurrency);
      $('#navbar').load(location.href + ' #navbar');
      $('.yield-container').load(location.href + ' .yield-container', function(){
        shipping();
        cartFunctions();
        $(".dropdown-toggle-cart").dropdown();
        filterFunctions();
      });

    });
  });
    //was inside currency.click function
    // tags = checkedTagBoxes().length>0 ? checkedTagBoxes() : 0;
    // var tagsForUrl='';
    // for(var i=0; i<tags.length; i++){
    //   tagsForUrl+=('&tags%5B%5D='+tags[i]);
    // };
    // lowPrice = localStorage.getItem('lowPrice');
    // highPrice = localStorage.getItem('highPrice');
    // currency = localStorage.getItem('currency');
    // var pagenumber= 1 ;
    // var sortBy= localStorage.getItem("sortBy");
    // var order=localStorage.getItem("order");
    // debugger;

    // forpushState(currency, lowPrice, highPrice, pagenumber, tags, tagsForUrl, sortBy, order);



  function forpushState(currency, lowPrice, highPrice, pagenumber, tags, sortBy, order, tagsForUrl){
    history.pushState({ currency: currency, low: lowPrice, high: highPrice, page: pagenumber,tags: tags, sort: sortBy, order: order }, '', '/categories/2/?' + 'page='+ pagenumber + '&low=' + lowPrice + '&high=' + highPrice + '&currency=' + currency + tagsForUrl + '&sort=' + sortBy + '&order=' + order);
  }

  function checkedTagBoxes(){
    var tagCheckBox = $('.tag-check-box').is(":visible") ? $('.tag-check-box') : $('.dropdown-tag-check-box');
    if (tagCheckBox.hasClass('tag-check-box')){
      var tags = $('.tag-check-box:checked').map(function (){
        return this.id;
      }).get();
    }
    else if (tagCheckBox.hasClass('dropdown-tag-check-box')) {
      var tags = $('.dropdown-tag-check-box:checked').map(function (){
        return this.id;
      }).get();
    };
    return tags
  }




  function updateCreditCard(){
    $('#exp-month, #exp-year').on('change', function () {
        // Set the value of a hidden input field for Card
        var expiryMonth= $('#exp-month').val();
        if ($('#exp-month').val().length<=1){
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

  $('.delete_order_item_checkout').bind('ajax:success', function() {
    $('.cart-info').load(location.href + ' .cart-info', function(){
      shipping();
      cartFunctions();
      orderItemCheckout();
    });
  });

  //order-item create.js
  $('.add-cart').closest('form').bind('ajax:success', function() {
    $('.dropdown-button-container').load(location.href + ' #dropdown-cart-button', function(){
      $(".dropdown-toggle-cart").dropdown();
      $('#dropdown-cart-button').addClass("open");
      cartFunctions();
      filterFunctions();
    });
    $('.add-cart').prop("disabled", false);
  });

  function placedivoverdiv(div1, div2){
    var position = $(div1).offset();
    var height = $(div1).outerHeight();
    var width = $(div1).outerWidth();
    $(div2).show();
    $(div2).css('height',height);
    $(div2).css('width',width);
    $(div2).css(position);
  };

  function shipping() {
    $('#shipping').click(function(event){
      event.preventDefault();
      if (formchecker()){
        $('.shipping-method-placeholder').show();
        placedivoverdiv('.spinner-placeholder','.circle-spinner');
        if ($('#shipping-cost-number').length>0){
          placedivoverdiv('#shipping-cost-number','.circle-spinner2');
        };
        var order_id= $("#shipping").attr('data-href');
        var name = $('input#name').val();
        var line1 = $('input#line1').val();
        var line2 = $('input#line2').val();
        var city = $('input#city').val();
        var state = $('input#state').val();
        var zip = $('input#zip').val();
        var country = $('#country').val();
        var windowWidth = $(window).width();
        if (windowWidth <= 650){
          placedivoverdiv('#address-form','.circle-spinner2');
          $('#address-form').hide();
          $("#order-summary-content").animate({
            left: "-100%"
          }, 1000);
        }
        else {
          $("#address-form").animate({
            left: "-100%"
          }, 1000);
        };
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
        var content = $(data).find('.shipping-page');
        $('.cart-page').html(content);
        $('.spinner').hide();
        shipping();
      });
    });

    function ajaxCall2() {
      var id = $("#shipping").attr('data-href');
      $.get("/orders/"+ id + "/shipping", function() {
      })
      .success(function (data) {
        var windowWidth = $(window).width();
        if (windowWidth <= 650){
          var shippingData= $(data).find('.shipping-method-address-container')
        }
        else{
          var shippingData= $(data).find('.shipping-content')
        };
        // $('#total-price').html('<%=number_to_currency@shipping%>');
        $('#order-summary-content').html(shippingData);
        $("#order-summary-content").animate({
          left: "0%"
        }, 1000);
        $('.checkout-progress-container').html($(data).find('.checkout-progress-container'));
        // $("#product-modal").modal("show");
        $('.circle-spinner').hide();
        $('.circle-spinner2').hide();
        $("#payment-form :input").prop("disabled", false);
        radioButtons();
        if (windowWidth >= 650){
          $('.shipping-content').animate({
            scrollTop: $(".sub-total").offset().top
          },'slow');
        };
      });
    };

    function radioButtons(){
      $('.rate-radio').on('change', function(){
        $("#submit-payment").prop("disabled", true);
        var id = $(".rate-radio").attr('data-href');
        var selected_rate = $("input[type='radio'][name='rate']:checked").val();
        placedivoverdiv('#shipping-cost-number', '.circle-spinner');
        $.ajax({
          type: "GET",
          url: "/orders/"+ id +"/shipping",
          data: { selected_rate: selected_rate},
          success : function(data){
            $('.circle-spinner').hide();
            var updatedTotals= $(data).find('.totals').is(":visible") ? '.totals' : '.sidecart-container';
            var updatedContent= $(data).find(updatedTotals)
            $(updatedTotals).html(updatedContent);
            $("#submit-payment").prop("disabled", false);
          }
        });
      });
    };

    function placedivoverdiv(div1, div2){
      var position = $(div1).offset();
      var height = $(div1).outerHeight();
      var width = $(div1).outerWidth();
      $(div2).show();
      $(div2).css('height',height);
      $(div2).css('width',width);
      $(div2).css(position);
    };

    function ajaxCall3(){
      $.get("/orders/new", function() {
      })
      .success( function (data) {
        var paymentForm = $(data).find('#payment-form');
        var windowWidth = $(window).width();
        if (windowWidth <= 650){
          $('#payment-form-placeholder').html(paymentForm);
          $("#payment-form-placeholder :input").prop("disabled", true);
          $("#payment-form-placeholder").animate({
            left: "0%"
          }, 1000);
        }
        else{
          $('#address-form').html(paymentForm);
          $("#address-form :input").prop("disabled", true);
          $("#address-form").animate({
            left: "0%"
          }, 1000);
        };
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
