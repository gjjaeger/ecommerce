class ChangeColumnDeliveryOrderItem < ActiveRecord::Migration[5.0]
  def change
    change_column :order_items, :delivery, :boolean, :default => true
  end
end
