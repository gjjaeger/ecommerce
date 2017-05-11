class ChargesController < ApplicationController
  def new
  end

  def create
    # Amount in cents
  
    customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :source  => params[:stripeToken]
    )


    current_order.order_items.each do |item|
      charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => Integer(item.product.price*100*item.quantity),
        :description => 'Rails Stripe customer',
        :currency    => 'usd'
      )

      order = Stripe::Order.create(
        :currency => 'usd',
        :email => params[:stripeEmail],
        :items => [
          {
            :type => 'sku',
            :parent => item.product.sku_id,
            :quantity => item.quantity,
          }
        ],
        :shipping => {
          :name => params[:stripeShippingName],
          :address => {
            :line1 => params[:stripeShippingAddressLine1],
            :city => params[:stripeShippingAddressCity],
            :country => params[:stripeShippingAddressCountry],
            :postal_code => params[:stripeShippingAddressZip]
          }
        },
      )
    end
    @shippingAddress=Address.create(:line1 => params[:stripeShippingAddressLine1], :city => params[:stripeShippingAddressCity],:country => params[:stripeShippingAddressCountry], :postal_code => params[:stripeShippingAddressZip])
    @order = Order.find(current_order)
    @order.status = "created"
    @order.address_id= @shippingAddress.id
    if @order.save
      session[:order_id]=nil
    end
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end
end
