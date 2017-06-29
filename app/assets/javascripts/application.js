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

  $('.dropdown-toggle').mouseenter(function(){
    $(this).parent().addClass("open");
  });

  $('.dropdown-toggle').mouseleave(function(){
    $(this).parent().removeClass("open");
  });

  $('.dropdown-menu').mouseenter(function(){
    $(this).prev(".dropdown-toggle").parent().addClass("open");
  });

  $('.dropdown-menu').mouseleave(function(){
    $(this).prev(".dropdown-toggle").parent().removeClass("open");
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

  function cartFunctions() {
    $('.quantity').val(0);

    var selectElement = $('.selectpicker').length > 0 ? $('.selectpicker') : null ;
    var quantityElement = $('.quantity').length > 0 ? $('.quantity') : null ;

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

    $('.quantity').on('input', function(){

      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        updateButton(quantityElement);
      };
    });

    $('.quantity').change(function(){
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        updateButton(quantityElement);
      };
      if ($(this).val()=="") {
        $(this).val(0);
      };

    });

    function quantityCheck(quantityElement){
      if (quantityElement.val()<="0") {
        return false;
      }
      else if (quantityElement.val()=="") {
        return false;
      }
      else {
        return true;
      };
    };

    function updateButtonWithSelect(selectElement, quantityElement){
      if (selectCheck(selectElement)&&quantityCheck(quantityElement)){
        $('.add-cart').prop('disabled', false);
      }
      else {
        $('.add-cart').prop('disabled', true);
      };
    };

    function updateButton(quantityElement){
      if (quantityCheck(quantityElement)){
        $('.add-cart').prop('disabled', false);
      }
      else {
        $('.add-cart').prop('disabled', true);
      };
    };

    $('.minus-quantity').on('click',function(){
      var quantity = parseInt(quantityElement.val());
      if (quantity > 0){
        quantityElement.val(quantity-1);
      };
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        updateButton(quantityElement);
      };
    });
    $('.plus-quantity').on('click',function(){
      var quantity = parseInt(quantityElement.val());
      quantityElement.val(quantity+=1);
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        var stock = quantityElement.attr('data-href') ? parseInt(quantityElement.attr('data-href')) : null
        var quantitySelected = parseInt(quantityElement.val())
        if (quantitySelected <= stock || stock==null){
          updateButton(quantityElement);
        }
        else {
          quantityElement.val(quantity-=1);
          $('.cart-notice').html("<span>Only " + quantityElement.attr('data-href') + " item(s) left in stock</span>")
        };

      };
    });
    $('.add-cart').on('click', function () {
      var cart = $('.cart-dropdown');
      $('#cake-modal').modal("hide");

      if ($(this).attr('id')=="jam-add-cart"){
        var imgtodrag = $(".product-show-image");
      }
      else if ($(this).attr('id')=="jewelery-add-cart") {
        var imgtodrag = $(".product-show-image");
      }
      else if ($(this).attr('id')=="cake-add-cart") {

        var imgtodrag = $(".product-show-image");
      };
      if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
            top: imgtodrag.offset().top,
            left: imgtodrag.offset().left
        })
            .css({
            'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
        })
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

  $('.tag-check-box').on('click', function(){
    $(this).toggleClass("active")
  });

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
      $( "#price" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    },
    stop: function(event, ui) {
      $('.spinner').show();
      var tags = $('.tag-check-box.active').map(function (){
        return this.id;
      }).get();
      tags = tags.length>0 ? tags : 0
      var id = $("#slider-3").attr('data-href')
      $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ], tags: tags }, function() {
        localStorage.setItem("lowPrice", ui.values[ 0 ]);
        localStorage.setItem("highPrice", ui.values[ 1 ]);
      })
      .success( function (data) {
        var tagsForUrl='';
        for(var i=0; i<tags.length; i++){
          tagsForUrl+=('&tags%5B%5D='+tags[i]);
        };
        history.pushState({ low: ui.values[ 0 ], high: ui.values[ 1 ], tags: tags }, '', '/categories/2/?' + 'low=' + ui.values[ 0 ] + '&high=' + ui.values[ 1 ] + tagsForUrl);
        var testingvar= history.state;
        products = $(data).find('#productss')
        $('#productss').html(products);
        $('.spinner').hide();
      })
    }
  });
  $( "#price" ).html( "$" + $( "#slider-3" ).slider( "values", 0 ) +
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
      $('.tag-check-box').removeClass('active');
      for (var i=0; i<tagParameters.length;i++){
        $('#'+tagParameters[i]).addClass('active');
      }
    };

    var minimumPrice = (getParameterByName('low') ? getParameterByName('low') : 0);
    var maximumPrice = (getParameterByName('high') ? getParameterByName('high') : 0);
    $( "#slider-3" ).slider({
      range:true,
      min: 0 ,
      max: 400,
      values: [ minimumPrice, maximumPrice ]
    });
    $( "#price" ).html( "$" + $( "#slider-3" ).slider( "values", 0 ) +
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


  $('.tag-check-box').click(function(){
    $('.spinner').show();
    var id = $("#slider-3").attr('data-href');
    var tags = $('.tag-check-box.active').map(function (){
      return this.id;
    }).get();
    tags = tags.length>0 ? tags : 0
    lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0
    highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400

    $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags }, function() {
    })
    .success( function (data) {
      var tagsForUrl='';
      for(var i=0; i<tags.length; i++){
        tagsForUrl+=('&tags%5B%5D='+tags[i]);
      };
      history.pushState({ low: lowPrice, high: highPrice, tags: tags }, '', '/categories/2/?' + 'low=' + lowPrice + '&high=' + highPrice + tagsForUrl);
      var testingvar= history.state;
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


  function shipping() {
    $('#shipping').click(function(event){
      event.preventDefault();
      $('.shipping-spinner').show();
      $("#product-modal").modal("hide");
      $('.shipping-text-wrapper').show();
      var order_id= $("#shipping").attr('data-href');
      var name = $('input#name').val();
      var line1 = $('input#line1').val();
      var line2 = $('input#line2').val();
      var city = $('input#city').val();
      var state = $('input#state').val();
      var zip = $('input#zip').val();
      var country = $('input#country').val();
      $.ajax({
        type: "POST",
        url: "/addresses",
        data: { address: { name: name, line1:line1, line2:line2, city:city, state:state, zip:zip, country:country } },
        success : function(html,status){
          ajaxCall2();
        }
      });
    });

    $('#paymentt').click(function(){
      $.get("/orders/new", function() {
      })
      .success( function (data) {
        products = $(data).find('#payment-form');
        $('.shipping-content').html(products);
        $('.spinner').hide();
      });
    });
    function ajaxCall2() {
      var id = $("#shipping").attr('data-href');
      $.get("/orders/"+ id + "/shipping", function() {
      })
      .success(function (data) {
        var shippingData= $(data).find('.shipping-content')
        $('#content').html(shippingData);
        $("#product-modal").modal("show");
        $('.shipping-spinner').hide();
        $('.shipping-text-wrapper').hide();
      });
    };
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
