class Shipment < ApplicationRecord
  belongs_to :order_item
end
