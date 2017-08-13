MoneyRails.configure do |config|

  # set the default currency
  config.default_currency = :sgd

  config.default_bank = EuCentralBank.new
  config.register_currency = {
    :priority            => 1,
    :iso_code            => "SGD",
    :name                => "Singapore Dollar",
    :symbol              => "S$",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 2,
    :iso_code            => "USD",
    :name                => "US Dollar",
    :symbol              => "$",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 3,
    :iso_code            => "AUD",
    :name                => "Australian Dollar",
    :symbol              => "$",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 5,
    :iso_code            => "GBP",
    :name                => "British Pound",
    :symbol              => "£",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 4,
    :iso_code            => "EUR",
    :name                => "Euro",
    :symbol              => "€",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 6,
    :iso_code            => "CAD",
    :name                => "Canadian Dollar",
    :symbol              => "$",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.register_currency = {
    :priority            => 50,
    :iso_code            => "JPY",
    :name                => "Japanese Yen",
    :symbol              => "¥",
    :symbol_first        => true,
    :subunit             => "Subcent",
    :subunit_to_unit     => 1,
    :thousands_separator => ",",
    :decimal_mark        => "."
  }
  config.default_bank.update_rates
  config.default_format = {
    :no_cents_if_whole => true,
    :symbol => nil,
    :sign_before_symbol => nil
  }
end
