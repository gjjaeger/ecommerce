class ChangeCategoryId < ActiveRecord::Migration[5.0]
  def change
    change_column :products, :category_id, :string
  end
end
