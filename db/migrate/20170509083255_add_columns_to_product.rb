class AddColumnsToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :description, :string
    add_column :products, :weight, :integer
    add_column :products, :size, :integer
  end
end
