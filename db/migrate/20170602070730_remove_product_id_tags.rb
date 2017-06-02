class RemoveProductIdTags < ActiveRecord::Migration[5.0]
  def change
    remove_column :tags, :product_id
  end
end
