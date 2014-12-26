
class Rack::Obfuscator
  def initialize(app)
    @app = app

    @obfuscate = [
    ['GET','/signin']
    ]

    @protect = [
    ['POST','/auth/identity/callback']
    ]

    @dict = {}
  end

  def call(env)
    pair = [env['REQUEST_METHOD'],env['REQUEST_PATH']]
    
    if @protect.include? pair
      invalid_request
    elsif env['REQUEST_PATH'].length == 21
      puts "checking #{env['REQUEST_PATH']} #{@dict}"
      if new_path = @dict.delete(env['REQUEST_PATH'][1..-1])
        puts "Setting new path #{new_path}"
        #env['REQUEST_URI'] = new_path
        #env['REQUEST_PATH'] = new_path
        env['PATH_INFO'] = new_path
        input = deobfuscate(env['rack.input'].read)
        env['rack.input'] = StringIO.new(input)
        env['QUERY_STRING'] = deobfuscate(env['QUERY_STRING'])
      end
    end


    response = @app.call(env)

    if @obfuscate.include? pair
      [response[0], response[1], [obfuscate(response[2][0])]]
    else
      response
    end

  end

  def invalid_request
    [500,{},["invalid request"]]
  end

  def obfuscate(text)
    r = /<form([^>]*?)action="([^"]+)"/m
    text = text.gsub(r) do |m|
      m =~ r
      hash = gen
      @dict[hash] = $2
      "<form #{$1} action=\"/#{hash}\""
    end
    
    r = /<input([^>]+)name="([^"]*?)"/m
    text = text.gsub(r) do |m|
      m =~ r
      hash = gen
      @dict[hash] = $2
      "<input#{$1}name=\"#{hash}\""
    end
  end

  def deobfuscate(string)
    return string if string.length < 10
    hash = Rack::Utils.parse_query(string)
    new_hash = {}
    hash.each{|k,v|
      if new_k = @dict.delete(k)
        new_hash[new_k] = v
      else
        new_hash[k] = v
      end
    }
    Rack::Utils.build_query(new_hash)
  end

  def gen
    SecureRandom.hex(10)
  end

end