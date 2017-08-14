class OrdersController < ApplicationController
  include ChargesHelper

  skip_before_action :verify_authenticity_token

  before_action :check_user, only: [:index, :show, :edit, :update, :destroy]


  # GET /orders
  # GET /orders.json
  def index
    if user_signed_in?
      @orders = current_user.account.orders
    elsif admin_signed_in?
      @orders=Order.all()
    end
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    @order=Order.find(params[:id])
  end

  # GET /orders/new
  def new
    @order = Order.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    @order = Order.new(order_params)
    @order.currency_total = current_currency

    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: 'Order was successfully created.' }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :new }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
        format.json { render :show, status: :ok, location: @order }
      else
        format.html { render :edit }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order.destroy
    respond_to do |format|
      format.html { redirect_to orders_url, notice: 'Order was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def checkout
    @order_total_currency_price=current_order.calculate_total(current_currency)
    @freeShippingAmount = freeShippingAmountCurrency
    @address = Address.new()
    @order=Order.find(current_order)
    render :layout=>'order_layout'
  end

  def cart
    @order_total_currency_price=current_order.calculate_total(current_currency)
    @order=Order.find(current_order)
    @freeShippingAmount = freeShippingAmountCurrency
    render :layout=>'order_layout'
  end

  def shipping
    shipment=EasyPost::Shipment.retrieve(current_order.shipment_id)

    @rates=shipment.rates
    @rates = @rates.each{|h| h.rate = Money.default_bank.exchange((h.rate), h.currency.upcase , current_currency.upcase)}
    @lowest_rate=Money.new((@rates.min_by{|h| h.rate}.rate), (@rates.min_by{|h| h.rate}.currency))
    @order=current_order
    @zero_object=Money.new(0,current_currency.upcase)
    order = Order.find(current_order)
    if !@order.order_items.any? {|order_item| order_item.product.category_id=="3" }
      totalship = @zero_object
      selected_rate = params[:selected_rate] ? (Money.new((@rates.select {|e| e.id == params[:selected_rate]}[0].rate),(@rates.select {|e| e.id == params[:selected_rate]}[0].currency.upcase))) : nil
      if current_order.total_price >= 200
        totalship= selected_rate ? (selected_rate-@lowest_rate) : @lowest_rate
      else
        totalship= params[:selected_rate] ? selected_rate : @lowest_rate
      end
      if params[:selected_rate]
        @shipping=((current_order.total_price)>=200 && selected_rate==@lowest_rate) ? @zero_object : totalship
      else
        @shipping=((current_order.total_price)>=200 ? @zero_object : totalship)
      end
      @order_total= current_order.calculate_total(current_currency.upcase)

      @total = @shipping + @order_total
      @total100 = @total
      order.total_shipping=totalship
      order.total_shipping_currency=totalship.currency.iso_code
      order.selected_rate = params[:selected_rate] ? params[:selected_rate] : @rates.min_by{|h| h[:rate]}.id
      order.save!
    end
    @address=Address.find_by("id = ?", current_order.address_id)
    if order.save
      respond_to do |format|

        format.html
        #I'm assuming its js request
      end
    end
  end

  def tracking
    request_string = request.body.read
    parsed_request = JSON.parse(request_string)

    if parsed_request['object'] == 'Event' && parsed_request['description'] == 'tracker.updated'
      event = EasyPost::Event.receive(request_string)
      tracker = event.result

      message = "Hey, this is FunCompany."
      if tracker.status == 'delivered'
        message += "Your package has arrived! "
      else
        message += "There's an update on your package: "
      end

      td = tracker.tracking_details.reverse.find{ |tracking_detail| tracking_detail.status == tracker.status }
      message += "#{tracker.carrier} says: #{td.message} in #{td.tracking_location.city}." if td.present?

      order=Order.find(params[:order_id])

      TrackerUpdateJob.set(wait: 20.seconds).perform_later(order.customer_email, message)
      # from = SendGrid::Email.new(email: 'test@fromaddress.com')
      # subject = 'Hello World from the SendGrid Ruby Library!'
      # to = SendGrid::Email.new(email: 'customer@gmail.com')
      # content = SendGrid::Content.new(type: 'text/plain', value: message)
      # mail = SendGrid::Mail.new(from, subject, to, content)
      #
      # output = settings.sendgrid.client.mail._("send").post(request_body: mail.to_json)

      [200, {}, "Email update was sent to the customer!"]
    else
      [200, {}, "Not a Tracker event, so nothing to do here for now..."]
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      # @order = Order.find(params[:id])
    end

    def check_user
      if admin_signed_in?
      else
        set_order
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:status, :account_id, :total_price)
    end
end
