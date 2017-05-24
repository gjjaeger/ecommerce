class AddShipmentIdOrderItems < ActiveRecord::Migration[5.0]
  def change
    add_column :order_items, :shipment_id, :string
  end
end
