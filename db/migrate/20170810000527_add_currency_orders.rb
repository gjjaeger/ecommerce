class AddCurrencyOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :currency_total, :string
  end
end
