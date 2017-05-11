class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  before_save :update_total
  before_create :update_status
  has_one :address

  def calculate_total
    self.order_items.collect { |item| item.product.price * item.quantity }.sum
  end

  private

  def update_status
    if self.status == nil?
      self.status = "In progress"
    end
  end

  def update_total
    self.total_price = calculate_total
  end
end
