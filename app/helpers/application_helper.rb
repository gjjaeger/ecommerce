module ApplicationHelper
  def major_currencies(hash)
    hash.inject([]) do |array, (id, attributes)|
      symbol = attributes[:symbol]
      priority = attributes[:priority]

      if priority && priority < 50
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

  def current
    if Thread.current[:currency]
      Thread.current[:currency]
    else
      IsoCountryCodes.find(IsoCountryCodes.search_by_name("Japan")[0].alpha2).currency
    end
  end
end
