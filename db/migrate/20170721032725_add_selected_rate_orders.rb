class AddSelectedRateOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :selected_rate, :string
  end
end
