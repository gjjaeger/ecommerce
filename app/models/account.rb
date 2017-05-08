class Account < ApplicationRecord
  has_many :orders, dependent: :destroy
end
