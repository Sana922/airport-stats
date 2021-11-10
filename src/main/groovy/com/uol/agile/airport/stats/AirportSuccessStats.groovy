package com.uol.agile.airport.stats

import org.bson.Document

import com.mongodb.Block
import com.mongodb.client.MongoClients
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Projections
import com.mongodb.client.model.Sorts


def successStats = { 
	
	def properties = new Properties()
	def propertiesFile = new File('src/main/resources/mongodb.properties')
	propertiesFile.withInputStream {
		properties.load(it)
	}

	// create connection 
	def mongoClient = MongoClients.create("mongodb+srv://${properties.USN}:${properties.PWD}@airportstatisticscluste.6wwm2.mongodb.net/${properties.DB}?retryWrites=true&w=majority");
	def db = mongoClient.getDatabase(properties.DB);
	def col = db.getCollection("travel-airport-stats")

	//Filtering using Match Aggregation
	def filter = Aggregates.match(Filters.lte("Time.Year", 2016));
	//Define Projection using Project Aggregation
	def projection = Aggregates.project(
			Projections.fields(
			Projections.excludeId(),
			Projections.include(
			"Airport.Name",
			"Statistics.Flights.OnTime",
			"Statistics.Flights.Cancelled",
			"Statistics.Flights.Total")
			));
	//Define group by clause using the Group Aggregation & Accumulator using Sum keyword
	def group = Aggregates.group( Arrays.asList('$'+"Airport.Name"),
			Accumulators.sum("CountOfOntime",'$'+"Statistics.Flights.OnTime"),
			Accumulators.sum("CountOfOnCancelled",'$'+"Statistics.Flights.Cancelled"),
			Accumulators.avg("CountOfOnCancelled",'$'+"Statistics.Flights.onTime",'$'+"Statistics.Flights.Total")
			);
	//Define order by clause using Sort Aggregation
	def sort = Aggregates.sort(Sorts.descending("CountOfOntime"));
	def startTime = System.currentTimeMillis();
	def resultList = col.aggregate(
			Arrays.asList(
			filter,
			projection,
			group,
			sort
			)).forEach({println it})
			
			
println("Total Execution Time in Milliseconds: " + (System.currentTimeMillis() - startTime));
		
}
//Provide the flight success statistics for the given Years
successStats()
