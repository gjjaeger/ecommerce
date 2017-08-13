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
    :subunit_to_unit     => 100,
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
