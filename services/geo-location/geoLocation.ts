import ConstructionSiteModel from "../../models/constructionSite.model.js";
import { ILocation } from "../../shared/interfaces/location.interface";
import CheckingModel from "../../models/checks.model.js";
class GeoLocation {

  async checkInUser(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<Object> {
    try {
        const constructionSiteLocation: ILocation | { error: string } = await this.getLocationOfConstructionSite(siteId);             
      if ('error' in constructionSiteLocation) {
        return { error: constructionSiteLocation.error };
      }    
    
      if (constructionSiteLocation && constructionSiteLocation.radius !== undefined) {
        const radius = constructionSiteLocation.radius; // Accessing the radius field
       console.log("construction site radius: "+radius)
             
      const { coordinates} = constructionSiteLocation;       
      console.log("construction site coordinates: "+coordinates)      
      const isWithinRadius = await this.calculateDistanceAndCheckRadius(userLocation.latitude, userLocation.longitude, coordinates[0], coordinates[1], constructionSiteLocation.radius);
     
      console.log("isWithinRadius: "+isWithinRadius)
      //hardcoded for testing - when the diff is more than 0.5 km
      //const isWithinRadius = await this.calculateDistanceAndCheckRadius(40.7128, -74.0060, 40.7178, -74.0060, { type: 0.5 });

       //hardcoded for testing - when the diff is within 0.5 km
       //const isWithinRadius = await this.calculateDistanceAndCheckRadius(40.7128, -74.0060, 40.7168, -74.0061, { type: 0.5 });

      if (isWithinRadius) {
        // If the location is within the radius, do check in & return a success message
          // Check if worker data exists
          const workerData = await CheckingModel.findOne({
            userType: "worker",
            userId: workerId,
            constructionSiteId: siteId
          });

          if (workerData) {
            // If worker data exists, update checkType and timeStamp
            workerData.checkType = "check-in"; 
            workerData.timeStamp = new Date(); 
            await workerData.save(); 
          } else {
            // If worker data doesn't exist, insert new data
            const checkIn = new CheckingModel({
                userType: "worker",
                checkType: "check-in",
                userId: workerId,
                constructionSiteId: siteId,
                timeStamp: new Date() 
            });     
            await checkIn.save(); 
          }
        return { message: "check in successful" };
      } else {
        // If the location is outside the radius, return an error message
        return { message: "Please be on site while check-in" };
      }
    }
    } catch (error) {
            return {"error": error}
      }
      return { message: "Something went wrong" };
  }

  async checkOutUser(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<Object> {
    try {
      // console.log(location,siteId,workerId);
      // const constructionSiteLocation = await this.getLocationOfConstructionSite(siteId);
      const workerData = await CheckingModel.findOne({
        userType: "worker",
        userId: workerId,
        constructionSiteId: siteId
      });

      if (workerData) {
        // If worker data exists, update checkType and timeStamp
        workerData.checkType = "check-out"; 
        workerData.timeStamp = new Date(); 
        await workerData.save(); 
      } else {
        // If worker data doesn't exist, insert new data
        const checkOut = new CheckingModel({
            userType: "worker",
            checkType: "check-out",
            userId: workerId,
            constructionSiteId: siteId,
            timeStamp: new Date() 
        });     
        await checkOut.save(); // Save the new document
      }
     return { message: "check out successful" };    
    } catch (error) {
          return {"error": error}
    }
  }

  async getLocationOfConstructionSite(siteId: string):  Promise<ILocation | { error: string }> {
    try {      
      const constructionSite = await ConstructionSiteModel.findOne({ companyId: siteId });

      if (!constructionSite) {
        return { error: "Construction site not found" };
      }

      const siteLocation = constructionSite.siteLocation as ILocation;
      return siteLocation;
    } catch (error) {
        return { error: "error"};
    }
  }

  
  async calculateDistanceAndCheckRadius(userLatitude: number, userLongitude: number, siteLatitude: number, siteLongitude: number,radius: { type: Number }): Promise<boolean> {
    // Convert radius in meters to kilometers;         
    const actualRadius =Number(radius) / 1000;    
   console.log("radius: "+actualRadius)
   console.log("userLatitude: "+userLatitude)
   console.log("userLongitude: "+userLongitude)
   console.log("siteLatitude: "+siteLatitude)
   console.log("siteLongitude: "+siteLongitude)
    const earthRadius: number = 6371; // Earth's radius in kilometers
    const deg2rad: (deg: number) => number = (deg: number) => deg * (Math.PI / 180);

    // Convert latitude and longitude from degrees to radians
    const userLatRad: number = deg2rad(userLatitude);
    const userLonRad: number = deg2rad(userLongitude);
    const siteLatRad: number = deg2rad(siteLatitude);
    const siteLonRad: number = deg2rad(siteLongitude);

    // Haversine formula
    const dLat: number = siteLatRad - userLatRad;
    const dLon: number = siteLonRad - userLonRad;
    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLatRad) * Math.cos(siteLatRad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm: number = earthRadius * c;

    console.log("Actual Radius>>> "+actualRadius);
    console.log("difference>>> "+distanceInKm);

      
    // Check if the distance is within the specified radius
    return distanceInKm <= actualRadius;
  }

  async getSafeZoneOfConstructionSite(siteId: string):  Promise<ILocation | { error: string }> {
    try {
      const constructionSite = await ConstructionSiteModel.findOne({ companyId: siteId });

      if (!constructionSite) {
        return { error: "Construction site not found" };
      }

      const safeZoneLocation = constructionSite.safeZoneLocation as ILocation;
      return safeZoneLocation;
    } catch (error) {
        return { error: "error"};
    }
  }

  //To check if worker is in safe zone.
  async checkIfUserInSafeZone(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<Object> {
    try {
      const safeZoneLocation: ILocation | { error: string } = await this.getSafeZoneOfConstructionSite(siteId);             
    if ('error' in safeZoneLocation) {
      return { error: safeZoneLocation.error };
    }    
  
    if (safeZoneLocation && safeZoneLocation.radius !== undefined) {
      const radius = safeZoneLocation.radius; // Accessing the radius field
     console.log("safeZoneLocation radius: "+radius)
           
    const { coordinates} = safeZoneLocation;       
    console.log("safeZoneLocation coordinates: "+coordinates)      
    const isWithinRadius = await this.calculateDistanceAndCheckRadius(userLocation.latitude, userLocation.longitude, coordinates[0], coordinates[1], safeZoneLocation.radius);
   
    console.log("isWithinRadius: "+isWithinRadius)
   
    if (isWithinRadius) {
          return { message: "Worker is in safe zone" };
    } else {
      return { message: "Worker is not in safe zone" };
    }
  }
  } catch (error) {
          return {"error": error}
    }
    return { message: "Something went wrong" };
  }

      
      
}


export default GeoLocation;
