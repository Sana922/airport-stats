// Requires official MongoShell 3.6+
db = db.getSiblingDB("AirportStatisticsCluster");
db.getCollection("travel-airport-stats").aggregate(
    [
        { 
            "$match" : { 
                "Time.Year" : { 
                    "$lt" : NumberInt(2016)
                }
            }
        }, 
        { 
            "$project" : { 
                "Airport.Name" : 1.0, 
                "Statistics.Flights.OnTime" : 1.0, 
                "Statistics.Flights.Cancelled" : 1.0
            }
        }, 
        { 
            "$group" : { 
                "_id" : "$Airport.Name", 
                "NumberOfFlightsOntime" : { 
                    "$sum" : "$Statistics.Flights.OnTime"
                }, 
                "NumberOfFlightsCancelled" : { 
                    "$sum" : "$Statistics.Flights.Cancelled"
                }
            }
        }, 
        { 
            "$sort" : { 
                "CountOfOntime" : -1.0
            }
        }
    ], 
    { 
        "allowDiskUse" : false
    }
);

