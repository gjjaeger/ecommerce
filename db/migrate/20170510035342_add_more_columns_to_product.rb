class AddMoreColumnsToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :sku_id, :integer
    add_column :products, :product_id, :integer
  end
end
