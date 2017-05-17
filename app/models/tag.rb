class Tag < ApplicationRecord
  has_many :products, :through=> :product_tags
  has_many :product_tags
  accepts_nested_attributes_for :product_tags
  belongs_to :category
end
