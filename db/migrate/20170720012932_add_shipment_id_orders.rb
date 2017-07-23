class AddShipmentIdOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :shipment_id, :string
  end
end
