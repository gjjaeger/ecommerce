class AddMainBooleanToCategories < ActiveRecord::Migration[5.0]
  def change
    add_column :categories, :main, :boolean
  end
end
