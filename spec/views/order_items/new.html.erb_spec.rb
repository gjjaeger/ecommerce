require 'rails_helper'

RSpec.describe "order_items/new", type: :view do
  before(:each) do
    assign(:order_item, OrderItem.new(
      :quantity => 1,
      :product_id => 1,
      :order_id => 1
    ))
  end

  it "renders new order_item form" do
    render

    assert_select "form[action=?][method=?]", order_items_path, "post" do

      assert_select "input#order_item_quantity[name=?]", "order_item[quantity]"

      assert_select "input#order_item_product_id[name=?]", "order_item[product_id]"

      assert_select "input#order_item_order_id[name=?]", "order_item[order_id]"
    end
  end
end
