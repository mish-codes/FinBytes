require "minitest/autorun"
require_relative "validate_etymology"

class TestValidateEtymology < Minitest::Test
  FIXTURES = File.join(__dir__, "fixtures")

  def validate(fixture)
    EtymologyValidator.new(File.join(FIXTURES, fixture)).validate
  end

  def test_valid_file_returns_empty_errors
    result = validate("valid_etymology.yml")
    assert_empty result.errors
    assert result.ok?
  end

  def test_duplicate_id_is_error
    result = validate("duplicate_id.yml")
    assert result.errors.any? { |e| e.include?("duplicate id") }
    refute result.ok?
  end

  def test_broken_parent_reference_is_error
    result = validate("broken_parent.yml")
    assert result.errors.any? { |e| e.include?("unknown parent") }
    refute result.ok?
  end

  def test_unknown_language_is_error
    result = validate("unknown_language.yml")
    assert result.errors.any? { |e| e.include?("unknown language") }
    refute result.ok?
  end

  def test_cycle_is_error
    result = validate("cycle.yml")
    assert result.errors.any? { |e| e.include?("cycle") }
    refute result.ok?
  end
end
