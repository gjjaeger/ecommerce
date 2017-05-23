class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  # before_filter :authenticate_user!, except: [:index, :show]
  before_filter :authenticate_admin!, only: [:new, :create, :update, :edit, :destroy]
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
      :attributes => ['size', 'weight'],
      :package_dimensions => {
        'height' => 0.0,
        'length' => 0.0,
        'width' => 0.0,
        'weight' => 0.0
      }
    )
    if (@product.category_id=="2")
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
          'quantity' => product_params[:stock]
        },
        :package_dimensions => {
          'height' => (BigDecimal(product_params[:height])/2.54).round(2),
          'length' => (BigDecimal(product_params[:length])/2.54).round(2),
          'width' => (BigDecimal(product_params[:width])/2.54).round(2),
          'weight' => (BigDecimal(product_params[:weight])/28.3495).round(2)
        }
      )
    end
    if (@product.category_id=="3")
      sku = Stripe::SKU.create(
        :product => product.id,
        :attributes => {
          'size' => product_params[:size],
          'weight' => product_params[:weight]
        },
        :price => (Integer(product_params[:price])*100),
        :currency => 'usd',
        :inventory => {
          'type' => 'infinite'
        }
      )
    end
    if (@product.category_id == "1")
      @product.sizes.each do |size|
        sku = Stripe::SKU.create(
          :product => product.id,
          :attributes => {
            'size' => Integer(size["amount"]),
            'weight' => Integer(size["amount"])
          },
          :price => (Integer(size["price"])*100),
          :currency => 'usd',
          :inventory => {
            'type' => 'infinite'
          },
          :package_dimensions => {
            'height' => (BigDecimal(size["height"])/2.54).round(2),
            'length' => (BigDecimal(size["length"])/2.54).round(2),
            'width' => (BigDecimal(size["width"])/2.54).round(2),
            'weight' => (BigDecimal(size["amount"])/28.3495).round(2)
          }
        )
        size.sku_id=sku.id
        size.save
      end
    end

    respond_to do |format|
      if @product.save
        if @product.category_id!="1"
          @product.sku_id = sku.id
        end
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

  def delivery
    @order_item=OrderItem.new()
    @product=Product.find(params[:product_id])
  end
  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    @product.category_id = params[:category_id]
    respond_to do |format|
      if @product.update(product_params)
        product = Stripe::Product.retrieve(@product.product_id)
        product.name=@product.name
        product.description=@product.description
        product.save
        if (@product.category_id=="2")
          sku=Stripe::SKU.retrieve(@product.sku_id)
          sku.price=Integer((@product.price)*100)
          sku.inventory["quantity"]=@product.stock
          sku.package_dimensions["height"]=(BigDecimal(@product.height)/2.54).round(2)
          sku.package_dimensions["length"]=(BigDecimal(@product.length)/2.54).round(2)
          sku.package_dimensions["width"]=(BigDecimal(@product.width)/2.54).round(2)
          sku.package_dimensions["weight"]=(BigDecimal(@product.weight)/28.3495).round(2)
          sku.save
        end
        if (@product.category_id=="3")
          sku=Stripe::SKU.retrieve(@product.sku_id)
          sku.price=Integer((@product.price)*100)
        end
        if (@product.category_id == "1")
          @product.sizes.each do |size|
            if size.sku_id!=nil
              sku=Stripe::SKU.retrieve(size.sku_id)
              sku.price=Integer((size.price)*100)
              sku.attributes["size"]=size.amount
              sku.attributes["weight"]=size.amount
              sku.package_dimensions["height"]=(BigDecimal(size.height)/2.54).round(2)
              sku.package_dimensions["length"]=(BigDecimal(size.length)/2.54).round(2)
              sku.package_dimensions["width"]=(BigDecimal(size.width)/2.54).round(2)
              sku.package_dimensions["weight"]=(BigDecimal(size.amount)/28.3495).round(2)
              sku.save
            else
              sku = Stripe::SKU.create(
                :product => @product.product_id,
                :attributes => {
                  'size' => Integer(size.amount),
                  'weight' => Integer(size.amount)
                },
                :price => Integer((size.price)*100),
                :currency => 'usd',
                :inventory => {
                  'type' => 'infinite'
                },
                :package_dimensions => {
                  'height' => (BigDecimal(size.height)/2.54).round(2),
                  'length' => (BigDecimal(size.length)/2.54).round(2),
                  'width' => (BigDecimal(size.width)/2.54).round(2),
                  'weight' => (BigDecimal(size.amount)/28.3495).round(2)
                }
              )
              size.sku_id=sku.id
              size.save
            end

          end
        end
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
    if (@product.category_id=="1")
      # sku = Stripe::SKU.retrieve(@product.sku_id)
      # sku.delete
      # product=Stripe::Product.retrieve(@product.product_id)
      # product.delete
    end
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
      params.require(:product).permit(:price, :height, :length, :width, :name, :size, :weight, :stock, :time_needed, :storage_inst, :featured, :description,:params, images_attributes: [:photo, :product_id], materials_attributes: [:id, :name, :product_id, :_destroy], ingredients_attributes: [:id, :name, :quantity, :product_id, :_destroy], sizes_attributes: [:id, :amount, :height, :sku_id, :length, :width, :price, :product_id, :_destroy], tag_ids: [])
    end
end
