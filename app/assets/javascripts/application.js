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
//= require bootstrap.min
//= require cocoon
//= require turbolinks
//= require_tree .

$(document).on('turbolinks:load', function() {
  $(document).on("page:fetch", function(){
    $("#loading-modal").modal("show");
    debugger;
  });

  $(document).on("page:receive", function(){
    $("#loading-modal").modal("hide")
  });
  $('#product-modal').on('shown.bs.modal', function() {
    $('.cake-quantity').val(0);
    $('.add-cart').prop('disabled', true);
    $('#carouselExampleIndicators').carousel();
    $("#requested_date").change(function(){
      $(this).datepicker('hide');
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
    $('#requested_date').datepicker({startDate : date,format: 'yyyy-mm-dd'});
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
  $(function() {
    var id = $("#slider-3").attr('data-href')
    if (id =='2'){
      $( "#slider-3" ).slider({
        range:true,
        min: 0,
        max: 350,
        values: [ 35, 350 ],
        slide: function( event, ui ) {
          $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        },
        stop: function(event, ui) {
          var id = $("#slider-3").attr('data-href')
          $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ] }, function() {
          })
          .success( function (data) {
            products = $(data).find('#productss')
            $('#productss').html(products);
          })
        }
      });
    }
    if (id =='1'){
      $( "#slider-3" ).slider({
        range:true,
        min: 0,
        max: 50,
        values: [ 0, 50 ],
        slide: function( event, ui ) {
          $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        },
        stop: function(event, ui) {
          var id = $("#slider-3").attr('data-href')
          $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ] }, function() {
          })
          .success( function (data) {
            products = $(data).find('#productss')
            $('#productss').html(products);
          })
        }
      });
    }
    if (id =='3'){
      $( "#slider-3" ).slider({
        range:true,
        min: 0,
        max: 100,
        values: [ 0, 100 ],
        slide: function( event, ui ) {
          $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        },
        stop: function(event, ui) {
          var id = $("#slider-3").attr('data-href')
          $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ] }, function() {
          })
          .success( function (data) {
            products = $(data).find('#productss')
            $('#productss').html(products);
          })
        }
      });
    }

    $( "#price" ).val( "$" + $( "#slider-3" ).slider( "values", 0 ) +
      " - $" + $( "#slider-3" ).slider( "values", 1 ) );
  });


  $(".dropdown-toggle").dropdown();
  $('.quantity').val(0);
  $('.add-cart').prop('disabled', true);

  $(".outer-category").click(function () {
    var id = $(this).attr("id");

    $('#' + id).siblings().find(".active-category").removeClass("active-category");
        //                       ^ you forgot this
    $('#' + id).addClass("active-category");
    localStorage.setItem("selectedolditem", id);
  });

  var selectedolditem = localStorage.getItem('selectedolditem');

  if (selectedolditem != null) {
    $('#' + selectedolditem).siblings().find(".active-category").removeClass("active-category");
    //                                        ^ you forgot this
    $('#' + selectedolditem).addClass("active-category");
  };
});

$(document).ready(function(){
  $(function() {
    var amount = '';
    var handler = StripeCheckout.configure({
      key: 'pk_test_3plF76arhkygGMgwCEerThpa',
      image: 'Mango-icon.png',
      token: function(token, args) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        console.log(token)
        var chargeData = {
          amount: amount,
          token: token
        }
        $.ajax({
            url: '/link/to/php/stripeDonate.php',
            type: 'post',
            data: {chargeData: chargeData},
            success: function(data) {
              if (data == 'success') {
                  console.log("Card successfully charged!")
              }
              else {
                  console.log("Success Error!")
              }

            },
            error: function(data) {
                  console.log("Ajax Error!");
                  console.log(data);
            }
          }); // end ajax call
      }
    });

    $('.donate-button').bind('click', function(e) {
      donationAmt = $(this).html().substring(1) + '00';
      donationAmt = parseInt(donationAmt); // Grabs the donation amount in the html of the button and store it in a variable
      // Open Checkout with further options
      handler.open({
        name: 'Company Name',
        description: 'A donation',
        amount: donationAmt
      });
      e.preventDefault();
    });
  });
  $("#loading-modal").modal("hide");

  // show spinner on AJAX start
  $(document).ajaxStart(function(){
    $("#loading-modal").modal("show");
    debugger;
  });

  // hide spinner on AJAX stop
  $(document).ajaxStop(function(){
    $("#loading-modal").modal("hide");
    debugger;
  });

  $(function() {
    $( "#slider-3" ).slider({
      range:true,
      min: 0,
      max: 350,
      values: [ 35, 200 ],
      slide: function( event, ui ) {
        $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      },
      stop: function(event, ui) {
        var id = $("#slider-3").attr('data-href')
        $.get("/categories/"+ id, { low: ui.values[ 0 ], high: ui.values[ 1 ] }, function() {
        })
        .success( function (data) {
          products = $(data).find('#productss')
          $('#productss').html(products);
        })
      }
    });
    $( "#price" ).val( "$" + $( "#slider-3" ).slider( "values", 0 ) +
      " - $" + $( "#slider-3" ).slider( "values", 1 ) );
  });

  $('#product-modal').on('shown.bs.modal', function() {
    $('.cake-quantity').val(0);
    $('.add-cart').prop('disabled', true);
    $('#carouselExampleIndicators').carousel();
    $("#requested_date").change(function(){
      $(this).datepicker('hide');
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
    $('#requested_date').datepicker({startDate : date,format: 'yyyy-mm-dd'});
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



  $(document).on('change','.quantity',function(){
    if ($(this).val()<=0) {
      $(this).parent().children('.add-cart').prop('disabled', true)
    }
    else {
      $(this).parent().children('.add-cart').prop('disabled', false)
    };
    if ($(this).val()=="") {
      $(this).val(0);
    };
  });
  $(document).on('click','.minus-quantity',function(){
    qelement = $(this).parent().children('.quantity');
    quantity = parseInt(qelement.val());
    if (quantity <=0){
      $(this).parent().children('.add-cart').prop('disabled', true)
    }
    else {
      qelement.val(quantity-1);
      if (qelement.val() <=0){
        $(this).parent().children('.add-cart').prop('disabled', true)
      }
    }
  });
  $(document).on('click','.plus-quantity',function(){
    qelement = $(this).parent().children('.quantity');
    quantity = parseInt(qelement.val());
    qelement.val(quantity+1);

    $(this).parent().children('.add-cart').prop('disabled', false)
  });



  //for cakes
  $(document).on('change','.cake-quantity',function(){
    if ($(this).val()<=0) {
      $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
    }
    else {
      $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
    };
    if ($(this).val()=="") {
      $(this).val(0);
    };
  });
  $(document).on('click','.minus-quantity',function(){
    qelement = $(this).parent().children('.cake-quantity');
    quantity = parseInt(qelement.val());
    if (quantity <=0){
      $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
    }
    else {
      qelement.val(quantity-1);
      if (qelement.val() <=0){
        $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', true)
      }
    }
  });
  $(document).on('click','.plus-quantity',function(){
    qelement = $(this).parent().children('.cake-quantity');
    quantity = parseInt(qelement.val());
    qelement.val(quantity+1);
    $(this).parent().parent().children('.modal-footer').children('.add-cart').prop('disabled', false)
  });

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
      debugger;
      that.parent().parent().parent().children('.row').children('#target').html(img);
    }
    reader.readAsDataURL(image);
  });

});
