require 'test_helper'

class MobileControllerTest < ActionController::TestCase
  test "should get talk" do
    get :talk
    assert_response :success
  end

end
