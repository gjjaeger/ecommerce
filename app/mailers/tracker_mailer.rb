class TrackerMailer < ActionMailer::Base

  def tracker_email(customer, message)
    @customer = customer
    @message = message
    mg_client = Mailgun::Client.new ENV['api_key']
    message_params = {:from    => ENV['gmail_username'],
                      :to      => @customer,
                      :subject => 'Sample Mail using Mailgun API',
                      :html    => '<h4>'+@message+'</h4>'}
    mg_client.send_message ENV['domain2'], message_params
  end
end
