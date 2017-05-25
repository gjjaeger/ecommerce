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
//= require bootstrap
//= require moment
//= require bootstrap-datepicker
//= require bootstrap.min
//= require cocoon
//= require turbolinks
//= require_tree .

$(document).on('turbolinks:load', function() {
  $(".dropdown-toggle").dropdown();
});

$(document).ready(function(){
  $('#product-modal').on('shown.bs.modal', function() {
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
  var today = new Date();

  $('#product-modal').on('shown.bs.modal', function() {
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


  $(document).on('click','#shipping',function(){
    var id = $("#shipping").attr('data-href')
    $.get( "/orders/"+ id +"/checkout", function() {
    })
    .done(function() {
      $("#product-modal").html("<%= escape_javascript(render 'shipping') %>");
      $("#product-modal").modal("show");
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
