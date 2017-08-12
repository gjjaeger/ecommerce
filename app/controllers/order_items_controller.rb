class OrderItemsController < ApplicationController
  before_action :set_order_item, only: [:show, :edit, :update, :destroy]

  # GET /order_items
  # GET /order_items.json
  def index
    @order_items = OrderItem.all
  end

  # GET /order_items/1
  # GET /order_items/1.json
  def show
  end

  # GET /order_items/new
  def new
    @order_item = OrderItem.new
  end

  # GET /order_items/1/edit
  def edit
  end

  # POST /order_items
  # POST /order_items.json
  def create
    @order = current_order
    if @order.order_items.exists?(product_id: item_params[:product_id])
      @item = @order.order_items.find_by({product_id: item_params[:product_id]})
      @item.quantity += item_params[:quantity].to_i
    else
      @item = @order.order_items.new(item_params)
    end
    @item.save!
    @order.save!
    session[:order_id] = @order.id

    # redirect_to product_path(params[:order_item][:product_id])

    # respond_to do |format|
    #   if @order_item.save
    #     format.html { redirect_to @order_item, notice: 'Order item was successfully created.' }
    #     format.json { render :show, status: :created, location: @order_item }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @order_item.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /order_items/1
  # PATCH/PUT /order_items/1.json
  def update
    respond_to do |format|
      if @order_item.update(order_item_params)
        format.html { redirect_to @order_item, notice: 'Order item was successfully updated.' }
        format.json { render :show, status: :ok, location: @order_item }
      else
        format.html { render :edit }
        format.json { render json: @order_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /order_items/1
  # DELETE /order_items/1.json
  def destroy
    @order = current_order
    @item = @order.order_items.find(params[:id])
    @item.destroy
    @order.save
    respond_to do |format|
      format.html { redirect_to products_path }
      format.json { head :no_content }
      format.js   { render :layout => false }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order_item
      @order_item = OrderItem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_item_params
      params.require(:order_item).permit(:quantity, :product_id, :order_id, :requested_date, :requested_time, :delivery)
    end

    def item_params
      params.require(:order_item).permit(:quantity, :product_id, :order_id)
    end
end
