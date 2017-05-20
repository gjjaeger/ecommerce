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
//= require bootstrap-datetimepicker
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
    var date = new Date();
    $('#datetimepicker1').datetimepicker({minDate: (date.setDate(date.getDate()+2))});
    $("#datetimepicker1").change(function(){
      var date2 = $(this).data("DateTimePicker").getDate();
      
      debugger;
      $('#expected-delivery').html(date2);
    });

  });
});
