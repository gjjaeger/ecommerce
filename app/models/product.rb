class Product < ApplicationRecord
  has_many :oder_items, dependent: :destroy
  has_many :images, dependent: :destroy
  belongs_to :category
end
