class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]
  before_filter :authenticate_admin!, except: [:index, :show]
  skip_before_filter :verify_authenticity_token
  require "stripe"

  # GET /products
  # GET /products.json
  def index
    @products = Product.all
    @order_item = current_order.order_items.new
    @order_items = current_order.order_items
    @jams= Product.where({category_id: "1"})
    @jewelery = Product.where({category_id: "2"})
    @cakes = Product.where({category_id: "3"})
    @categories=Category.all
  end

  # GET /products/1
  # GET /products/1.json
  def show
    @order_item = current_order.order_items.new
  end

  # GET /products/new
  def new
    @product = Product.new
    @categories = Category.all.map{|c| [ c.name, c.id ] }
  end

  # GET /products/1/edit
  def edit
    @categories = Category.all.map{|c| [ c.name, c.id ] }
    @product=Product.find(params[:id])
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(product_params)
    @product.category_id = params[:category_id]

    Stripe.api_key = "sk_test_dcJW97Ip8Tjmj2e3Vjtiu6Tq"
    product = Stripe::Product.create(
      :name => product_params[:name],
      :description => product_params[:description],
      :attributes => ['size', 'weight']
    )
    if (@product.category_id=="3" || @product.category_id=="2")
      sku = Stripe::SKU.create(
        :product => product.id,
        :attributes => {
          'size' => product_params[:size],
          'weight' => product_params[:weight]
        },
        :price => (Integer(product_params[:price])*100),
        :currency => 'usd',
        :inventory => {
          'type' => 'finite',
          'quantity' => 1
        }
      )
    end
    if (@product.category_id == "1")
      sku = Stripe::SKU.create(
        :product => product.id,
        :attributes => {
          'size' => 3,
          'weight' => 4
        },
        :price => 500,
        :currency => 'usd',
        :inventory => {
          'type' => 'finite',
          'quantity' => 1
        }
      )
    end

    respond_to do |format|
      if @product.save
        @product.sku_id = sku.id
        @product.product_id = product.id
        @product.save
        format.html { redirect_to products_path, notice: 'Product was successfully created.' }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render :new }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end
  def delete
    @product = Product.find(params[:product_id])
  end
  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    @product.category_id = params[:category_id]
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to products_path, notice: 'Product was successfully updated.' }
        format.json { render :show, status: :ok, location: @product }
      else
        format.html { render :edit }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product = Product.find(params[:id])
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url, notice: 'Product was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:price, :name, :size, :weight, :stock, :time_needed, :storage_inst, :featured, :description,:params, images_attributes: [:photo, :product_id], materials_attributes: [:id, :name, :product_id, :_destroy], ingredients_attributes: [:id, :name, :quantity, :product_id, :_destroy], sizes_attributes: [:id, :amount, :price, :product_id, :_destroy], tag_ids: [])
    end
end
