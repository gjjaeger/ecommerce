class AddCustomerEmailColumnOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :customer_email, :string
  end
end
