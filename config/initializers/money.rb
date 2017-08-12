MoneyRails.configure do |config|

  # set the default currency
  config.default_currency = :sgd

  config.default_bank = EuCentralBank.new

  config.default_bank.update_rates
  config.default_format = {
    :no_cents_if_whole => true,
    :symbol => nil,
    :sign_before_symbol => nil
  }
end
