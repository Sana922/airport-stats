// Requires official MongoShell 3.6+
db = db.getSiblingDB("AirportStatisticsCluster");
db.getCollection("travel-airport-stats").aggregate(
    [
        { 
            "$match" : { 
                "Time.Year" : NumberLong(2010)
            }
        }, 
        { 
            "$project" : { 
                "Time.Year" : 1.0, 
                "Time.Label" : 1.0, 
                "Statistics.Flights.Delayed" : 1.0, 
                "Statistics.NumberOfDelays.Carrier" : 1.0, 
                "Statistics.NumberOfDelays.LateAircraft" : 1.0, 
                "Statistics.NumberOfDelays.NationalAviationSystem" : 1.0, 
                "Statistics.NumberOfDelays.Security" : 1.0
            }
        }, 
        { 
            "$group" : { 
                "_id" : "$Time.Label", 
                "TotalDelayed" : { 
                    "$sum" : "$Statistics.Flights.Delayed"
                }, 
                "DelaysDueToCarrier" : { 
                    "$sum" : "$Statistics.NumberOfDelays.Carrier"
                }, 
                "DelaysDueToLateAircraft" : { 
                    "$sum" : "$Statistics.NumberOfDelays.LateAircraft"
                }, 
                "DelaysDueToNAS" : { 
                    "$sum" : "$Statistics.NumberOfDelays.NationalAviationSystem"
                }, 
                "DelaysDueToSecurity" : { 
                    "$sum" : "$Statistics.NumberOfDelays.Security"
                }, 
                "DelaysDueToWeather" : { 
                    "$sum" : "$Statistics.NumberOfDelays.Weather"
                }
            }
        }, 
        { 
            "$sort" : { 
                "Statistics.Flights.Delayed" : -1.0
            }
        }
    ], 
    { 
        "allowDiskUse" : false
    }
);

