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
//= require bootstrap-datepicker
//= require bootstrap-datetimepicker
//= require bootstrap-select
//= require bootstrap.min
//= require cocoon
//= require turbolinks
//= require_tree .

// $(document).on('turbolinks:load', function() {
//   $(function() {
//     $('#search').on('keyup', function() {
//       var pattern = $(this).val();
//       $('.searchable-container .items').hide();
//       $('.searchable-container .items').filter(function() {
//           return $(this).text().match(new RegExp(pattern, 'i'));
//       }).show();
//     });
//   });
//
//
//
//   $('.add-cart').on('click', function () {
//     var cart = $('.cart-dropdown');
//
//     if ($(this).attr('id')=="jam-add-cart"){
//       var imgtodrag = $(this).parent().parent().parent().parent('.size').find('.size-image').eq(0);
//     }
//     else if ($(this).attr('id')=="jewelery-add-cart") {
//       var imgtodrag = $(".product-show-image");
//     }
//     else if ($(this).attr('id')=="cake-add-cart") {
//
//       var imgtodrag = $(".product-show-image");
//     };
//     if (imgtodrag) {
//       var imgclone = imgtodrag.clone()
//           .offset({
//           top: imgtodrag.offset().top,
//           left: imgtodrag.offset().left
//       })
//           .css({
//           'opacity': '0.5',
//               'position': 'absolute',
//               'height': '150px',
//               'width': '150px',
//               'z-index': '100'
//       })
//           .appendTo($('body'))
//           .animate({
//           'top': cart.offset().top + 10,
//               'left': cart.offset().left + 10,
//               'width': 75,
//               'height': 75
//       }, 1000, 'easeInOutExpo');
//
//
//
//       imgclone.animate({
//           'width': 0,
//               'height': 0
//       }, function () {
//           $(this).detach()
//       });
//     }
//   });
//
//   $(document).on("page:fetch", function(){
//     $("#loading-modal").modal("show");
//     debugger;
//   });
//
//   $(document).on("page:receive", function(){
//     $("#loading-modal").modal("hide")
//   });
//   $('#product-modal').on('shown.bs.modal', function() {
//
//     $('#datetimepicker3').datetimepicker({
//       format: 'LT'
//     });
//
//     $('.cake-quantity').val(0);
//     $('.add-cart').prop('disabled', true);
//     $('#carouselExampleIndicators').carousel();
//     $("#datetimepicker1").change(function(){
//       $(this).datetimepicker('hide');
//     });
//     $('.add-cart').on('click', function () {
//       var cart = $('.cart-dropdown');
//       if ($(this).attr('id')=="jam-add-cart"){
//         var imgtodrag = $(this).parent().parent().parent().parent('.size').find('.size-image').eq(0);
//       }
//       else if ($(this).attr('id')=="jewelery-add-cart") {
//         var imgtodrag = $(".product-show-image");
//       }
//       else if ($(this).attr('id')=="cake-add-cart") {
//         var imgtodrag = $(".product-show-image");
//       };
//       if (imgtodrag) {
//         var imgclone = imgtodrag.clone()
//             .offset({
//             top: imgtodrag.offset().top,
//             left: imgtodrag.offset().left
//         })
//             .css({
//             'opacity': '0.5',
//                 'position': 'absolute',
//                 'height': '150px',
//                 'width': '150px',
//                 'z-index': '100'
//         })
//             .appendTo($('body'))
//             .animate({
//             'top': cart.offset().top + 10,
//                 'left': cart.offset().left + 10,
//                 'width': 75,
//                 'height': 75
//         }, 1000, 'easeInOutExpo');
//
//
//
//         imgclone.animate({
//             'width': 0,
//                 'height': 0
//         }, function () {
//             $(this).detach()
//         });
//       }
//     });
//     // var date = new Date();
//     // $('#datetimepicker1').datetimepicker({minDate: (date.setDate(date.getDate()+2))});
//     // $("#datetimepicker1").change(function(){
//     //   var date2 = $(this).data("DateTimePicker").getDate();
//     //   $('#expected-delivery').html(date2._d);
//     // });
//   });
//
//
//   $('#product-modal').on('shown.bs.modal', function() {
//     var today = new Date();
//     var dater = today.setDate(today.getDate() + parseInt($('#prep_time').val()));
//     var date=new Date(dater);
//     $('#datetimepicker1').datetimepicker({minDate : date, format: 'L'});
//     if ($('.delivery-option').val()=="1"){
//       $('.delivery-title').show();
//
//     };
//     $('.delivery-option').change(function(){
//       if ($(this).val()=="1"){
//         $('.delivery-title').show();
//         $('.pickup-title').hide();
//       };
//       if ($(this).val()=="0"){
//         $('.delivery-title').hide();
//         $('.pickup-title').show();
//       };
//     });
//   });
//
//   var id = $("#slider-3").attr('data-href')
//   $( "#slider-3" ).slider({
//     range:true,
//     min: (id='2' ? 5 : 0) ,
//     max: (id='2' ? 400 : 50),
//     values: [ (id='2' ? 5 : 0), (id='2' ? 400 : 50) ],
//     slide: function( event, ui ) {
//       $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
//     },
//     stop: function(event, ui) {
//       var tags = $('.tag-check-box.active').map(function (){
//         return this.id;
//       }).get();
//       tags = tags.length>0 ? tags : 0
//       var id = $("#slider-3").attr('data-href')
//       $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ], tags: tags }, function() {
//         localStorage.setItem("lowPrice", ui.values[ 0 ]);
//         localStorage.setItem("highPrice", ui.values[ 1 ]);
//       })
//       .success( function (data) {
//         products = $(data).find('#productss')
//         $('#productss').html(products);
//       })
//     }
//   });
//   $( "#price" ).val( "$" + $( "#slider-3" ).slider( "values", 0 ) +
//     " - $" + $( "#slider-3" ).slider( "values", 1 ) );
//
//
//   $('.tag-check-box').change(function(){
//     debugger;
//     var id = $("#slider-3").attr('data-href');
//     var tags = $('.tag-check-box.active').map(function (){
//       return this.id;
//     }).get();
//     tags = tags.length>0 ? tags : 0
//     lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0
//     highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400
//
//     $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags }, function() {
//     })
//     .success( function (data) {
//       products = $(data).find('#productss')
//       $('#productss').html(products);
//     })
//   });
//
//
//
//   $(".dropdown-toggle").dropdown();
//   $('.quantity').val(0);
//   $('.add-cart').prop('disabled', true);
//
//   $(".outer-category").click(function () {
//     var id = $(this).attr("id");
//
//     $('#' + id).siblings().find(".active-category").removeClass("active-category");
//         //                       ^ you forgot this
//     $('#' + id).addClass("active-category");
//     localStorage.setItem("selectedolditem", id);
//   });
//
//   var selectedolditem = localStorage.getItem('selectedolditem');
//
//   if (selectedolditem != null) {
//     $('#' + selectedolditem).siblings().find(".active-category").removeClass("active-category");
//     //                                        ^ you forgot this
//     $('#' + selectedolditem).addClass("active-category");
//   };
// });





$(document).on('turbolinks:load', function(){
  $('.selectpicker').selectpicker({
    size: 'false'
  });
  localStorage.setItem("lowPrice", 0);
  localStorage.setItem("highPrice", 400);
  $(".dropdown-toggle").dropdown();

  $('#search').on('keyup', function() {
      var pattern = $(this).val();
      $('.searchable-container .items').hide();
      $('.searchable-container .items').filter(function() {
          return $(this).text().match(new RegExp(pattern, 'i'));
      }).show();
  });



  $("#loading-modal").modal("hide");

  // show spinner on AJAX start
  $(document).ajaxStart(function(){
    $("#loading-modal").modal("show");

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
      debugger;
      var quantity = parseInt(quantityElement.val());
      quantityElement.val(quantity+=1);
      if (selectElement != null){
        updateButtonWithSelect(selectElement, quantityElement);
      }
      else {
        updateButton(quantityElement);
      };
    });
    $('.add-cart').on('click', function () {
      var cart = $('.cart-dropdown');

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
    });
  };

  cartFunctions(); //run functions for non-cakes

  // hide spinner on AJAX stop
  $(document).ajaxStop(function(){
    $("#loading-modal").modal("hide");
  });

  $('.tag-check-box').on('click', function(){
    $(this).toggleClass("active")
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
      $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    },
    stop: function(event, ui) {

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
        products = $(data).find('#productss')
        $('#productss').html(products);
      })
    }
  });
  $( "#price" ).val( "$" + $( "#slider-3" ).slider( "values", 0 ) +
    " - $" + $( "#slider-3" ).slider( "values", 1 ) );


  $('.tag-check-box').click(function(){
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
      products = $(data).find('#productss')
      $('#productss').html(products);
    });
  });
  $('#product-modal').on('shown.bs.modal', function() {

    $('#shipping').click(function(event){

      var order_id= $("#shipping").attr('data-href');

      $.get("/orders/"+ id + "/shipping", function() {
      })
      .success( function (data) {

        shipping = $(data).find('.shipping-content')
        $("#product-modal").modal("show");
        $('#content').html(shipping);
      });
      event.preventDefault()
    });
  });

  $('#product-modal').on('shown.bs.modal', function() {
    cartFunctions();
    $('.cake-quantity').val(0);
    $('.add-cart').prop('disabled', true);
    $('#carouselExampleIndicators').carousel();
    $("#datetimepicker1").change(function(){
      $(this).datetimepicker('hide');
    });
    $('#datetimepicker3').datetimepicker({
      format: 'LT'
    });
    // var date = new Date();
    // $('#datetimepicker1').datetimepicker({minDate: (date.setDate(date.getDate()+2))});
    // $("#datetimepicker1").change(function(){
    //   var date2 = $(this).data("DateTimePicker").getDate();
    //   $('#expected-delivery').html(date2._d);
    // });

  });


  $('#product-modal').on('shown.bs.modal', function() {
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
  });



  // for cake
  // $('.minus-quantity').on('click',function(){
  //   quantityElement = $(this).parent().children('.quantity');
  //   quantity = parseInt(quantityElement.val());
  //   if (quantity <=0){
  //     $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
  //   }
  //   else {
  //     quantityElement.val(quantity-1);
  //     if (quantityElement.val() <=0){
  //       $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
  //     }
  //   }
  // });





  //for cakes
  // $(document).on('change','.cake-quantity',function(){
  //   debugger;
  //   if ($(this).val()<=0) {
  //     $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
  //   }
  //   else {
  //     $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
  //   };
  //   if ($(this).val()=="") {
  //     $(this).val(0);
  //   };
  // });

  // for cakes
  // $(document).on('click','.plus-quantity',function(){
  //   quantityElement = $(this).parent().children('.cake-quantity');
  //   quantity = parseInt(quantityElement.val());
  //   quantityElement.val(quantity+1);
  //   $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
  // });

  $(document).on('click','#shipping',function(){
    var id = $("#shipping").attr('data-href')
    $.get( "/orders/"+ id +"/checkout", function() {
      $("#loading-modal").modal("show");
    })
    .done(function() {
      setTimeout(function(){$("#loading-modal").modal("hide");},3000);
      $("#product-modal").modal("hide");
    })
  });
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
});






// $(document).ready(function(){
//   localStorage.setItem("lowPrice", 0);
//   localStorage.setItem("highPrice", 400);
//
//   $('#search').on('keyup', function() {
//       var pattern = $(this).val();
//       $('.searchable-container .items').hide();
//       $('.searchable-container .items').filter(function() {
//           return $(this).text().match(new RegExp(pattern, 'i'));
//       }).show();
//   });
//
//
//
//   $("#loading-modal").modal("hide");
//
//   // show spinner on AJAX start
//   $(document).ajaxStart(function(){
//     $("#loading-modal").modal("show");
//
//   });
//
//   // hide spinner on AJAX stop
//   $(document).ajaxStop(function(){
//     $("#loading-modal").modal("hide");
//   });
//
//   $('.tag-check-box').on('click', function(){
//     $(this).toggleClass("active")
//   });
//
//
//   $('#datetimepicker3').datetimepicker({
//     format: 'LT'
//   });
//
//
//
//     var id = $("#slider-3").attr('data-href')
//     $( "#slider-3" ).slider({
//       range:true,
//       min: (id='2' ? 5 : 0) ,
//       max: (id='2' ? 400 : 50),
//       values: [ (id='2' ? 5 : 0), (id='2' ? 400 : 50) ],
//       slide: function( event, ui ) {
//         $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
//       },
//       stop: function(event, ui) {
//
//         var tags = $('.tag-check-box.active').map(function (){
//           return this.id;
//         }).get();
//         tags = tags.length>0 ? tags : 0
//         var id = $("#slider-3").attr('data-href')
//         $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ], tags: tags }, function() {
//           localStorage.setItem("lowPrice", ui.values[ 0 ]);
//           localStorage.setItem("highPrice", ui.values[ 1 ]);
//         })
//         .success( function (data) {
//           products = $(data).find('#productss')
//           $('#productss').html(products);
//         })
//       }
//     });
//     $( "#price" ).val( "$" + $( "#slider-3" ).slider( "values", 0 ) +
//       " - $" + $( "#slider-3" ).slider( "values", 1 ) );
//
//
//     $('.tag-check-box').click(function(){
//     var id = $("#slider-3").attr('data-href');
//     var tags = $('.tag-check-box.active').map(function (){
//       return this.id;
//     }).get();
//     tags = tags.length>0 ? tags : 0
//     lowPrice = localStorage.getItem('lowPrice') ? localStorage.getItem('lowPrice') : 0
//     highPrice = localStorage.getItem('highPrice') ? localStorage.getItem('highPrice') : 400
//
//     $.get("/categories/"+ id, {low: lowPrice, high: highPrice ,tags: tags }, function() {
//     })
//     .success( function (data) {
//       products = $(data).find('#productss')
//       $('#productss').html(products);
//     })
//   });
//
//   $('#product-modal').on('shown.bs.modal', function() {
//     $('.cake-quantity').val(0);
//     $('.add-cart').prop('disabled', true);
//     $('#carouselExampleIndicators').carousel();
//     $("#datetimepicker1").change(function(){
//       $(this).datetimepicker('hide');
//     });
//     $('#datetimepicker3').datetimepicker({
//       format: 'LT'
//     });
//     // var date = new Date();
//     // $('#datetimepicker1').datetimepicker({minDate: (date.setDate(date.getDate()+2))});
//     // $("#datetimepicker1").change(function(){
//     //   var date2 = $(this).data("DateTimePicker").getDate();
//     //   $('#expected-delivery').html(date2._d);
//     // });
//   });
//
//
//   $('#product-modal').on('shown.bs.modal', function() {
//     var today = new Date();
//     var dater = today.setDate(today.getDate() + parseInt($('#prep_time').val()));
//     var date=new Date(dater);
//     $('#datetimepicker1').datetimepicker({minDate : date,format: 'L'});
//     if ($('.delivery-option').val()=="1"){
//       $('.delivery-title').show();
//
//     };
//     $('.delivery-option').change(function(){
//       if ($(this).val()=="1"){
//         $('.delivery-title').show();
//         $('.pickup-title').hide();
//       };
//       if ($(this).val()=="0"){
//         $('.delivery-title').hide();
//         $('.pickup-title').show();
//       };
//     });
//   });
//
//
//
//   $(document).on('change','.quantity',function(){
//     if ($(this).val()<=0) {
//       $(this).parent().children('.add-cart').prop('disabled', true)
//     }
//     else {
//       $(this).parent().children('.add-cart').prop('disabled', false)
//     };
//     if ($(this).val()=="") {
//       $(this).val(0);
//     };
//   });
//
//   $(document).on('click','.minus-quantity',function(){
//     quantityElement = $(this).parent().children('.quantity');
//     quantity = parseInt(quantityElement.val());
//     if (quantity <=0){
//       $(this).parent().children('.add-cart').prop('disabled', true)
//     }
//     else {
//       quantityElement.val(quantity-1);
//       if (quantityElement.val() <=0){
//         $(this).parent().children('.add-cart').prop('disabled', true)
//       }
//     }
//   });
//   $(document).on('click','.plus-quantity',function(){
//     quantityElement = $(this).parent().children('.quantity');
//     quantity = parseInt(quantityElement.val());
//     quantityElement.val(quantity+1);
//
//     $(this).parent().children('.add-cart').prop('disabled', false)
//   });
//
//
//
//   //for cakes
//   $(document).on('change','.cake-quantity',function(){
//     if ($(this).val()<=0) {
//       $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
//     }
//     else {
//       $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
//     };
//     if ($(this).val()=="") {
//       $(this).val(0);
//     };
//   });
//   $(document).on('click','.minus-quantity',function(){
//     quantityElement = $(this).parent().children('.cake-quantity');
//     quantity = parseInt(quantityElement.val());
//     if (quantity <=0){
//       $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
//     }
//     else {
//       quantityElement.val(quantity-1);
//       if (quantityElement.val() <=0){
//         $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
//       }
//     }
//   });
//   $(document).on('click','.plus-quantity',function(){
//     quantityElement = $(this).parent().children('.cake-quantity');
//     quantity = parseInt(quantityElement.val());
//     quantityElement.val(quantity+1);
//     $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
//   });
//
//   $(document).on('click','#shipping',function(){
//     var id = $("#shipping").attr('data-href')
//     $.get( "/orders/"+ id +"/checkout", function() {
//       $("#loading-modal").modal("show");
//     })
//     .done(function() {
//       setTimeout(function(){$("#loading-modal").modal("hide");},3000);
//       $("#product-modal").modal("hide");
//     })
//
//   });
//   $(document).on('change','#pictureInput',function(event){
//     var files = event.target.files;
//     var image = files[0]
//     var that = $(this)
//     var reader = new FileReader();
//     reader.onload = function(file) {
//       var img = new Image();
//       img.src = file.target.result;
//       img.class="preview-img";
//       debugger;
//       that.parent().parent().parent().children('.row').children('#target').html(img);
//     }
//     reader.readAsDataURL(image);
//   });
//
// });
