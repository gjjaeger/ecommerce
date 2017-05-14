class AddColumnsToOrderItems < ActiveRecord::Migration[5.0]
  def change
    add_column :order_items, :size, :integer
  end
end
