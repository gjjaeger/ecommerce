class ProductTag < ApplicationRecord
  belongs_to :tag
  belongs_to :product
  accepts_nested_attributes_for :tag
  accepts_nested_attributes_for :product
end
