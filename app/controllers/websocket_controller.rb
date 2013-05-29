# require 'action_dispatch'
class WebsocketController < WebsocketRails::BaseController


  def initialize_session
   unless controller_store[:id_num]
    controller_store[:id_num] = 0
    controller_store[:red] = Redis.new
    Thread.abort_on_exception = true
    Thread.new do
      puts "starting listener"
        # watch_pipe('redis')
        subscribe_to_redis
      end
    end
  end

  def connected
    puts "connected!"
    # session[:client_id]
    # puts session[:client_id]
    # puts "conncook"
  end

  def send_response(send_channel, msg)
    # puts session[:client_id]
    # puts session.class
    if send_channel
      WebsocketRails[:"#{send_channel}"].trigger(:event, msg)
    else
      puts "no channel specified, skipping #{msg}"
    end
  end

  # def process_file
  #   controller_store[:red].multi do
  #     controller_store[:red].incr "sendMsgNum"
  #     @msgid = controller_store[:red].get "sendMsgNum"
  #   end
  #   f = params['myfile'][:tempfile].read
  #   # puts f
  #   controller_store[:red].hmset("sendMsg:#{@msgid.value}","file",f)
  #   # controller_store[:red].hmset("sendMsg:#{@msgid.value}","client",f)
  #   controller_store[:red].publish("toCapy","sendMsg:#{@msgid.value}")

  #   # @@red.rpush("toCapyQ",f)
  #   # @@red.publish("toCapy",@msgid.value)
  #   # haml :processing
  # end

  def send_text
    puts "sendin text message for #{session[:client_id]}"
    red = Redis.new
    red.multi do
      red.incr "sendMsgNum"
      @msgid = red.get "sendMsgNum"
    end

    # f= params['upfile'].tempfile.read
    # puts "\n\nclid\n#{session[:client_id]}"
    red.hmset("sendMsg:#{@msgid.value}","text",message,"client",session[:client_id])
    # red.hmset("sendMsg:#{@msgid.value}")
    red.publish("toCapy","sendMsg:#{@msgid.value}")
    send_response(session[:client_id], "you: " + message)

  end

  def get_new_id
    newid = controller_store[:id_num]
    puts "session"
    session[:client_id]=newid
    puts session[:client_id]
    puts "session2"
    controller_store[:current_client]=newid # Temporary
    controller_store[:id_num]+=1
    trigger_success(newid)
  end

  def subscribe_to_redis
    redis = Redis.new
    redisRead = Redis.new
    puts "subscribing"
    redis.subscribe(:fromCapy) do |on|
      on.message do |channel, msg|
        # data = JSON.parse(msg)
        # fileReply = redisRead.hget(msg,"file")

        reply = redisRead.hget(msg,"text")

        client = redisRead.hget(msg,"client")
        if reply[0] == "@"
          reply = reply[1..-1]
          process_internal(reply, client)
        else
          puts "sending #{reply} to #{client}"
          send_response(client, reply)
        end

        # puts "sending #{reply} to #{controller_store[:current_client]}"
        # send_response(controller_store[:current_client], reply)


        # puts "##{channel} - [#{data['user']}]: #{data['msg']}"
      end
    end
  end

  def process_internal(msg, client)
    if msg == "transcribe"
      WebsocketRails[:"#{client}"].trigger(:progress, msg)
    elsif msg == "think"
      WebsocketRails[:"#{client}"].trigger(:progress, msg)
    elsif msg == "search"
      WebsocketRails[:"#{client}"].trigger(:progress, msg)
    elsif msg == "listen"
      WebsocketRails[:"#{client}"].trigger(:progress, msg)
    end
  end

  def set_language

  end

  def set_method

  end
end