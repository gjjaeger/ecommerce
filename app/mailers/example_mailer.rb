class ExampleMailer < ActionMailer::Base

  def sample_email(user)
    @user = user
    mg_client = Mailgun::Client.new ENV['api_key']
    message_params = {:from    => ENV['gmail_username'],
                      :to      => @user,
                      :subject => 'Sample Mail using Mailgun API',
                      :html    => '<h4>Thank you for your purchase</h4>'}
    mg_client.send_message ENV['domain2'], message_params
  end
end
