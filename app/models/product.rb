class Product < ApplicationRecord
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
end
