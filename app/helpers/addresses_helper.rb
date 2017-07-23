module AddressesHelper
  def weight_in_ounces(weight,quantity)
    return (BigDecimal(weight*quantity)/28.3495).to_f
  end

  def g_to_ounces(weight)
    return (BigDecimal(weight)/28.3495).to_f
  end

  def retrieve_size_measurement(size, product_id, type)
    measurement=Size.find_by({amount: size, product_id: product_id}).("#{type}")
    return measurement
  end

  def retrieve_size_width(size, product_id)
    measurement=Size.find_by({amount: size, product_id: product_id}).width
    return measurement
  end

  def retrieve_size_length(size, product_id)
    measurement=Size.find_by({amount: size, product_id: product_id}).length
    return measurement
  end

  def retrieve_size_height(size, product_id)
    measurement=Size.find_by({amount: size, product_id: product_id}).height
    return measurement
  end

  def cm_to_inches(measurement)
    inches=(BigDecimal(measurement)/2.54).to_f
    return inches
  end
end
