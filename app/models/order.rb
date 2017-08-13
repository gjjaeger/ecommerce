class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  before_save :update_total
  before_create :update_status
  has_one :address
  register_currency :sgd


  def calculate_total(currency)
    self.order_items.collect { |item| Money.new(item.product.price, "SGD").exchange_to(currency.upcase) * item.quantity }.sum
  end

  def calculate_sgd_total
    self.order_items.collect { |item| item.product.price * item.quantity }.sum
  end

  def calculate_usd_total
    self.order_items.collect { |item| Money.new(item.product.price, "SGD").exchange_to("USD") * item.quantity }.sum
  end

  private

  def update_status
    if self.status == nil?
      self.status = "In progress"
    end
  end

  def update_total
    current_currency=ApplicationController.helpers.current
    self.total_price = calculate_total(current_currency)
    self.currency_total = current_currency
  end


end
