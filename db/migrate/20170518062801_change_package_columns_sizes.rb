class ChangePackageColumnsSizes < ActiveRecord::Migration[5.0]
  def change
    change_column :sizes, :height, :integer
    change_column :sizes, :length, :integer
    change_column :sizes, :width, :integer
  end
end
