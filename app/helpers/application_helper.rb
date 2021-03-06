module ApplicationHelper
  def major_currencies(hash)
    hash.inject([]) do |array, (id, attributes)|
      symbol = attributes[:symbol]
      priority = attributes[:priority]

      if priority && priority < 10
        array[priority] ||= []
        array[priority] << {id: id , symbol: attributes[:symbol]}
      end
      array
    end.compact.flatten
  end
  def all_currencies(hash)
    hash.inject([]) do |array, (id, attributes)|
      symbol = attributes[:symbol]
      array << {id: id , symbol: attributes[:symbol]}
      array
    end.compact.flatten
  end

  def current_order
    if session[:order_id]
      return Order.find(session[:order_id])
    else
      return Order.new()
    end
  end

  def current
    if Thread.current[:currency]
      Thread.current[:currency]
    else
      IsoCountryCodes.find(IsoCountryCodes.search_by_name("Japan")[0].alpha2).currency
    end
  end

  def freeShippingAmount
    return 200
  end

  def freeShippingAmountUSD
    Money.new(freeShippingAmount, "USD")
  end

  def freeShippingAmountCurrency
    Money.default_bank.exchange(freeShippingAmount, "USD", current_currency.upcase)
  end
end
