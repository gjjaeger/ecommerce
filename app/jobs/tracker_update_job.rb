class TrackerUpdateJob < ActiveJob::Base
  queue_as :default

  def perform(customer, message)
    @customer = customer
    @message = message
    TrackerMailer.tracker_email(customer,message).deliver_later
  end
end
