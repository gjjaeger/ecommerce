class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_order
  helper_method :current_order_items
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
end
