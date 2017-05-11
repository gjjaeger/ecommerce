class AddColumnsProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :sku_id, :string
    add_column :products, :product_id, :string
  end
end
