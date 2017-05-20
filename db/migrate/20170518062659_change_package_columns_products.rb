class ChangePackageColumnsProducts < ActiveRecord::Migration[5.0]
  def change
    change_column :products, :height, :integer
    change_column :products, :length, :integer
    change_column :products, :width, :integer
  end
end
