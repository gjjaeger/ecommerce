class RemoveColumnsProduct < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :sku_id
    remove_column :products, :product_id
  end
end
