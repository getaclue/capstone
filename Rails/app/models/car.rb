class Car < ApplicationRecord
	#according to http://www.rentalcars.com/SearchResults.do?doYear=2016&puLocationType=airport&serverName&rateQualifier.frequentTravelerIDNumber&fromFts=true&type&driversAge=25&countryCode=ca&doMinute=0&rateQualifier.discountNbr&puYear=2016&puSearchAgainInput=Ottawa%20Intl%2C%20CA%20(YOW)&puMinute=0&searchType=geosearch&doDay=22&coordinates=45.3225%2C-75.669167&puMonth=10&rateQualifier.rateCode&carCategory&doHour=10&puSearchInput=Ottawa%20Intl%2C%20CA%20(YOW)&rateQualifier.accountNo&puDay=31&newSearchResults=true&puHour=10&preferred_company&rateQualifier.partnerCode&doMonth=11&filterName=CarCategorisationSupplierFilter
	validates :size, inclusion: { in: %w(small intermediate full size SUV van special),
    message: "Please enter a valid size: small, medium or large" }

	belongs_to :client #belongs_to used for model with FK
	has_many :appointments, dependent: :nullify  # updates the associated records foreign
                                              # key value to NULL rather than destroying it
end
