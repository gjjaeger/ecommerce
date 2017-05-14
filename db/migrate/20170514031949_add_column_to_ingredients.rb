class AddColumnToIngredients < ActiveRecord::Migration[5.0]
  def change
    add_column :ingredients, :product_id, :integer
  end
end
