class AddSkuIdColumnsSizes < ActiveRecord::Migration[5.0]
  def change
    add_column :sizes, :sku_id, :string
  end
end
