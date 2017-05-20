class AddPackageColumnsToSizes < ActiveRecord::Migration[5.0]
  def change
    add_column :sizes, :height, :decimal
    add_column :sizes, :length, :decimal
    add_column :sizes, :width, :decimal
  end
end
