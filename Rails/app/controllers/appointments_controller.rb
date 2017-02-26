class AppointmentsController < ApplicationController
  before_action :authenticate_user_from_token!

  def index
    # TODO:
    # load the appointments based on the current week number
    # thus, appointments need a weeknumber attribute

    equality = params[:filter].present? && params[:filter][:week].present? && params[:filter][:year].present?

    if equality
      appointments_array=Appointment.where('week_number = ?', params[:filter][:week]).all
    else
      current_week = Time.now.strftime("%U").to_i
      appointments_array=Appointment.where('week_number = ?', current_week).all
    end

    if appointments_array && !appointments_array.empty?
      render json: appointments_array, status: :ok
    else
      render json: [], status: :ok
    end
  end

  def show
    begin
      appointment=Appointment.find params[:id]
      render json: appointment, status: :ok
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: 'This appointment does not exist' }, status: :not_found
    end
  end

  def create
    begin
      sanitized_params = appointment_sanitized_params
      #setting employee to default employee
      if sanitized_params[:employee_id].nil?
        sanitized_params[:employee_id] = 0
      end

      appointment=Appointment.new(sanitized_params)

      if appointment.save!
        render json: appointment, status: :created
      else
        render json: { error: 'Appointment creation failed. Check your data.'}, status: :bad_request
      end
    rescue ActiveModelSerializers::Adapter::JsonApi::Deserialization::InvalidDocument => e
      render json: { error: 'Appointment creation failed. No parameters sent.'}, status: :bad_request
    rescue ActiveRecord::StatementInvalid => e
      render json: { error: 'Appointment creation failed. Check your data.'}, status: :bad_request
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: appointment.errors.messages}, status: :bad_request
    end
  end

  def update
    begin
      appointment=Appointment.find params[:id]
      sanitized_params = appointment_sanitized_params

      if sanitized_params[:employee_id] == nil
        sanitized_params[:employee_id] = 0
      end

      if appointment.update!(sanitized_params)
        render json: appointment, status: :ok
      else
        render json: { error: 'Appointment update failed'}, status: :bad_request
      end
    rescue ActiveModelSerializers::Adapter::JsonApi::Deserialization::InvalidDocument => e
      render json: { error: 'Appointment update failed. No parameters sent.'}, status: :bad_request
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: 'No such appointment exists' }, status: :not_found
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: appointment.errors.messages}, status: :bad_request
    rescue ActiveRecord::StatementInvalid => e
     render json: { error: 'Appointment update failed. Check your data.'}, status: :bad_request
    end
  end

  def destroy
    if current_user && current_user.admin?
      begin
        appointment=Appointment.find params[:id]
        appointment.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: 'No such appointment exists' }, status: :not_found
      end
    else
      render json: { error: 'Not Authorized' }, status: 401
    end
  end

  private

  def appointment_sanitized_params
    #take a Hash or an instance of ActionController::Parameters representing a JSON API payload, and return a hash that
    #can directly be used to create/update models. The ! version throws an InvalidDocument exception when parsing fails,
    # whereas the "safe" version simply returns an empty hash.
    ActiveModelSerializers::Deserialization.jsonapi_parse!(params, only: [:color, :text_color, :title, :start, :end, :notes, :status, :client, :service, :employee, :week_number, :cost] )
  end

end
