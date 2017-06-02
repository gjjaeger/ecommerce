class Ingredient < ApplicationRecord
  belongs_to :product
  before_save :capitalize_name

private
  def capitalize_name
    self.name.capitalize!
  end
end
