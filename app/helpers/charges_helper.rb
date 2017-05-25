module ChargesHelper
  def retrieve_size_price(size,product_id)
    size_price = Size.where({amount: size, product_id: product_id}).first.price
    return size_price
  end

  def retrieve_size_sku(size, product_id)
    size_sku = Size.where({amount: size, product_id: product_id}).first.sku_id
    return size_sku
  end
end
