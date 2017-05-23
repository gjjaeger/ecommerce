class AddPickupOrderItems < ActiveRecord::Migration[5.0]
  def change
    add_column :order_items, :pickup, :boolean
  end
end
