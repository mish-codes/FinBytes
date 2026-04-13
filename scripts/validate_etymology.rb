require "yaml"

class EtymologyValidator
  KNOWN_LANGUAGES = %w[en grc la fro gem sa pie unk].freeze

  Result = Struct.new(:errors) do
    def ok?
      errors.empty?
    end
  end

  def initialize(path)
    @path = path
  end

  def validate
    errors = []
    entries = YAML.load_file(@path)

    unless entries.is_a?(Array)
      return Result.new(["file must contain a YAML list at the top level"])
    end

    seen_ids = {}
    entries.each_with_index do |entry, i|
      id = entry["id"]
      if id.nil? || id.to_s.empty?
        errors << "entry #{i}: missing id"
        next
      end
      if seen_ids.key?(id)
        errors << "duplicate id '#{id}' (first seen at index #{seen_ids[id]}, again at #{i})"
      else
        seen_ids[id] = i
      end

      lang = entry["language"]
      unless KNOWN_LANGUAGES.include?(lang)
        errors << "entry '#{id}': unknown language '#{lang}' (known: #{KNOWN_LANGUAGES.join(', ')})"
      end
    end

    # Build id -> entry map (use first occurrence for duplicate ids)
    by_id = {}
    entries.each do |e|
      id = e["id"]
      by_id[id] ||= e if id
    end

    # Check parent references
    by_id.each do |id, entry|
      parents = entry["parents"] || []
      parents.each do |pid|
        unless by_id.key?(pid)
          errors << "entry '#{id}': unknown parent '#{pid}'"
        end
      end
    end

    # Three-color DFS cycle detection (white=unvisited, grey=on stack, black=done)
    color = {}
    by_id.each_key { |id| color[id] = :white }

    cycle_errors = []

    by_id.each_key do |start|
      next unless color[start] == :white
      dfs_stack = [[start, false]]
      until dfs_stack.empty?
        id, returning = dfs_stack.pop
        if returning
          color[id] = :black
          next
        end
        next if color[id] == :black
        if color[id] == :grey
          cycle_errors << "cycle detected involving '#{id}'"
          next
        end
        color[id] = :grey
        dfs_stack.push([id, true])  # push return marker
        parents = (by_id[id] || {})["parents"] || []
        parents.each do |pid|
          next unless by_id.key?(pid)
          if color[pid] == :grey
            cycle_errors << "cycle detected involving '#{pid}'"
          elsif color[pid] == :white
            dfs_stack.push([pid, false])
          end
        end
      end
    end

    errors.concat(cycle_errors)
    Result.new(errors.uniq)
  end
end

if __FILE__ == $PROGRAM_NAME
  path = ARGV[0] || File.join(__dir__, "..", "docs", "_data", "etymology.yml")
  result = EtymologyValidator.new(path).validate
  if result.ok?
    puts "OK: #{path}"
    exit 0
  else
    warn "VALIDATION FAILED: #{path}"
    result.errors.each { |e| warn "  - #{e}" }
    exit 1
  end
end
