class MobileController < ApplicationController
  skip_before_filter  :verify_authenticity_token

  def talk
    # session[:client_id] = "abc"
    # puts "session set to #{session[:client_id]}"
  end

  def file_upload
    session[:client_id] = params[:clid] if params[:clid]
  end

  def process_file

  puts "uploading file for #{session[:client_id]}"
    red = Redis.new
    red.multi do
      red.incr "sendMsgNum"
      @msgid = red.get "sendMsgNum"
    end
  # f = params['myfile'][:tempfile].read
  f= params['upfile'].tempfile.read
  # puts "\n\nclid\n#{session[:client_id]}"
  red.hmset("sendMsg:#{@msgid.value}","file",f,"client",session[:client_id])
  # red.hmset("sendMsg:#{@msgid.value}")
  red.publish("toCapy","sendMsg:#{@msgid.value}")

    respond_to do |type|
      type.html {redirect_to(mobile_file_upload_url)}
    end
  end

end
