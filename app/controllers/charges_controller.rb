class ChargesController < ApplicationController
  require 'stripe'
  require 'easypost'
  def new
  end

  def create
    order=Order.find(current_order)
    address=Address.find(order.address_id)
    # Amount in cents
    customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :source  => params[:stripeToken]
    )

    charge = Stripe::Charge.create(
      :customer    => customer.id,
      :amount      => Integer(current_order.total_shipping*100),
      :description => "Shipping",
      :currency    => 'usd'
    )


    current_order.order_items.each do |item|
      charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => if(item.product.category_id=="1")
                          Size.where({amount: item.size, product_id: item.product.id}).first.price*100*item.quantity
                        else
                          Integer(item.product.price*100*item.quantity)
                        end,
        :description => params[:stripeEmail],
        :currency    => 'usd'
      )

      order = Stripe::Order.create(
        :currency => 'usd',
        :email => params[:stripeEmail],
        :items => [
          {
            :type => 'sku',
            :parent =>  if(item.product.category_id=="1")
                          Size.where({amount: item.size, product_id: item.product.id}).first.sku_id
                        else
                          item.product.sku_id
                        end,
            :quantity => item.quantity,
          }
        ],
        :shipping => {
          :name => address.name,
          :address => {
            :line1 => address.line1,
            :line2 => address.line2,
            :city => address.city,
            :state => address.state,
            :country => address.country,
            :postal_code => address.zip
          }
        },
      )
    end

    session[:rates].each do |rate|
      shipment=EasyPost::Shipment.retrieve(rate[5])
      shipment.buy(rate: shipment.lowest_rate())
      label = shipment.label(file_format:"PDF")
    end

    # @shippingAddress=Address.create(:line1 => params[:stripeShippingAddressLine1], :city => params[:stripeShippingAddressCity],:country => params[:stripeShippingAddressCountry], :postal_code => params[:stripeShippingAddressZip])
    @order = Order.find(current_order)
    @order.status = "created"
    # @order.address_id= @shippingAddress.id
    if current_user
      @order.account_id=current_user.account.id
    end
    if current_admin
      @order.account_id=1
    end
    if @order.save
      current_order.order_items.each do |item|
        if item.product.category_id =="2"
          item.product.stock-=item.quantity
          item.product.save
        end
      end
      session[:order_id]=nil
      redirect_to products_path
    end
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end
end
