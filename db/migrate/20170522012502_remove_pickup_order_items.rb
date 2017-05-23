class RemovePickupOrderItems < ActiveRecord::Migration[5.0]
  def change
    remove_column :order_items, :pickup
  end
end
