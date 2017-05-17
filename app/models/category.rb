class Category < ApplicationRecord
  has_many :products, dependent: :destroy
  has_many :tags, dependent: :destroy
end
