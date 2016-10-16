class UsersController < ApplicationController
  def index
    users = User.all
    render json: users, status: :ok
  end

  def show
    user = User.find_by_id(params[:id])
    render json: user, status: :ok
  end
end
