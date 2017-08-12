class Product < ApplicationRecord
  require 'eu_central_bank'
  eu_bank = EuCentralBank.new
  Money.default_bank = eu_bank
  monetize :price, :as => "pricer"
  Money.default_bank.update_rates
  register_currency :sgd
  has_many :order_items, dependent: :destroy
  has_many :materials, inverse_of: :product, dependent: :destroy
  accepts_nested_attributes_for :materials, reject_if: :all_blank, allow_destroy: true
  has_many :ingredients, inverse_of: :product, dependent: :destroy
  accepts_nested_attributes_for :ingredients, reject_if: :all_blank, allow_destroy: true
  has_many :sizes, inverse_of: :product, dependent: :destroy
  accepts_nested_attributes_for :sizes, reject_if: :all_blank, allow_destroy: true
  has_many :images, inverse_of: :product, dependent: :destroy
  accepts_nested_attributes_for :images, reject_if: :all_blank, allow_destroy: true
  belongs_to :category
  has_many :tags, :through=> :product_tags
  has_many :product_tags
  accepts_nested_attributes_for :product_tags
  def self.search(search)
    where("name LIKE ? OR ingredients LIKE ? OR materials LIKE ?", "%#{search}%", "%#{search}%", "%#{search}%")
  end

  def currency_price (currency)
    Money.new(self.price*100,'SGD').exchange_to(currency){|x| x.round()}
  end
end
