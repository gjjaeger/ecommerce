class AddShipmentCurrencyOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :total_shipping_currency, :string
  end
end
