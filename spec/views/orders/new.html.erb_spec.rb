require 'rails_helper'

RSpec.describe "orders/new", type: :view do
  before(:each) do
    assign(:order, Order.new(
      :status => "MyString",
      :account_id => 1,
      :total_price => ""
    ))
  end

  it "renders new order form" do
    render

    assert_select "form[action=?][method=?]", orders_path, "post" do

      assert_select "input#order_status[name=?]", "order[status]"

      assert_select "input#order_account_id[name=?]", "order[account_id]"

      assert_select "input#order_total_price[name=?]", "order[total_price]"
    end
  end
end
