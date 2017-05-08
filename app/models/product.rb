class Product < ApplicationRecord
  has_many :oder_items, dependent: :destroy
end
