class ChargesController < ApplicationController
  include ChargesHelper
  require 'stripe'
  require 'easypost'
  require 'mail'
  def new
  end

  def create
    order_object=Order.find(current_order)
    address=Address.find(order_object.address_id)
    # Amount in cents
    customer = Stripe::Customer.create(
      :email => params[:email],
      :source  => params[:stripeToken]
    )
    if current_order.total_shipping > 0
      charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => Integer(current_order.total_shipping*100),
        :description => "Shipping/Delivery",
        :currency    => 'usd'
      )
    end
    current_order.order_items.each do |item|
      charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => if(item.product.category_id=="1")
                          retrieve_size_price(item.size, item.product_id)*100*item.quantity
                        else
                          Integer(item.product.price*100*item.quantity)
                        end,
        :description => params[:email],
        :currency    => 'usd'
      )
      order = Stripe::Order.create(
        :currency => 'usd',
        :email => params[:email],
        :items => [
          {
            :type => 'sku',
            :parent =>  if(item.product.category_id=="1")
                          retrieve_size_sku(item.size, item.product.id)
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
      if !current_order.order_items.any? {|order_item| order_item.product.category_id=="3" }
        shipment=EasyPost::Shipment.retrieve(item.shipment_id)
        purchased=shipment.buy(rate: shipment.lowest_rate())
        label = shipment.label(file_format:"PDF")
        tracker=purchased[:tracker]
        trackerObject = EasyPost::Tracker.create({
          tracking_code: "EZ1000000001" #tracker[:id]
        })
        EasyPost::Webhook.create({url: "http://4f3dd57b.ngrok.io/orders/"+(order_object.id).to_s+"/tracking"})
        @shipment = Shipment.create(:recipient => address.name, :tracker_code => tracker[:tracking_code], :carrier => tracker[:carrier], :est_delivery_date => tracker[:est_delivery_date], :order_item_id => item.id, :shipment_id => shipment.id, :public_url => tracker[:public_url])
      end
    end

    # session[:rates].each do |rate|
    #   shipment=EasyPost::Shipment.retrieve(rate[5])
    #   purchased=shipment.buy(rate: shipment.lowest_rate())
    #   byebug
    #   label = shipment.label(file_format:"PDF")
    # end

    # @shippingAddress=Address.create(:line1 => params[:stripeShippingAddressLine1], :city => params[:stripeShippingAddressCity],:country => params[:stripeShippingAddressCountry], :postal_code => params[:stripeShippingAddressZip])
    @order = Order.find(current_order)
    @order.status = "created"
    @order.customer_email=params[:email]
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
      if @order.order_items.any? {|order_item| !order_item.delivery && order_item.product.category_id=="3"}
        order.order_items.each do |item|
          item.delivery = false
          item.save
        end
      elsif @order.order_items.any? {|order_item| order_item.delivery && order_item.product.category_id=="3"}
        order.order_items.each do |item|
          item.delivery = true
          item.save
        end
      end
      session[:order_id]=nil
      # Mail.defaults do
      #   delivery_method :smtp, {
      #     :port      => 587,
      #     :address   => "smtp.mailgun.com",
      #     :domain         => ENV['domain'],
      #     :user_name      => ENV['username'],
      #     :password       => ENV['password'],
      #     :openssl_verify_mode => 'none',
      #     :authentication => :plain,
      #   }
      # end
      #
      # mail = Mail.deliver do
      #   to      'peterparkster109@gmail.com'
      #   from    'gabrieljaeger1@gmail.com'
      #   subject 'Hello'
      #
      #   text_part do
      #     body 'Testing some Mailgun awesomness'
      #   end
      # end
      SendEmailJob.set(wait: 20.seconds).perform_later(params[:stripeEmail])

      redirect_to thanks_path
    end
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_order_path
  end
end
