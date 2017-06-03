class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_order
  helper_method :current_order_items
  helper_method :in_singapore
  include ChargesHelper

  def current_order
    if session[:order_id]
      Order.find(session[:order_id])
    else
      Order.new
    end
  end

  def current_order_items
    current_order.order_items
  end

  def in_singapore
    true
    # request.safe_location.country == "Singapore"
  end
end
