class AddPackageColumnsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :height, :decimal
    add_column :products, :length, :decimal
    add_column :products, :width, :decimal
  end
end
