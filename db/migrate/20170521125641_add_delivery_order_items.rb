class AddDeliveryOrderItems < ActiveRecord::Migration[5.0]
  def change
    add_column :order_items, :delivery, :boolean
  end
end
