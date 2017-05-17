class DropProductCategories < ActiveRecord::Migration[5.0]
  def change
    drop_table :product_categories
  end
end
