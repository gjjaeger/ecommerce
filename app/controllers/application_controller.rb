class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_order
  helper_method :current_order_items
  helper_method :in_country
  helper_method :current_currency
  include ChargesHelper

  def current_order
    if session[:order_id]
      Order.find(session[:order_id])
    else
      Order.new()
    end
  end

  def update_currency
    session[:currency] = params[:currency]
    Thread.current[:currency]=params[:currency]
    @order =Order.find(current_order)
    @order.save!
  end

  def current_order_items
    current_order.order_items
  end

  def in_country
    return request.safe_location.country
  end

  def currency
    if Thread.current[:currency]
      Thread.current[:currency]
    else
      return IsoCountryCodes.find(IsoCountryCodes.search_by_name("Japan")[0].alpha2).currency
    end
  end

  def current_currency
    if session[:currency]
      current_currency = session[:currency]
    else
      current_currency = IsoCountryCodes.find(IsoCountryCodes.search_by_name("Japan")[0].alpha2).currency
    end
    return current_currency
  end

end
