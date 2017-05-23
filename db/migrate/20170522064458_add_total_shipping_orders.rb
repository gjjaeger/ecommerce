class AddTotalShippingOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :total_shipping, :decimal
  end
end
