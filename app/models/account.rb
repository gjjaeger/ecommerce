class Account < ApplicationRecord
  has_many :orders, dependent: :destroy
  belongs_to :user
end
