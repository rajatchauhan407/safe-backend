import ConstructionSiteModel from "../../models/constructionSite.model.js";
import { ILocation } from "../../shared/interfaces/location.interface";
import CheckingModel from "../../models/checks.model.js";
class GeoLocation {

  async checkInUser(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<Object> {
    try {
      console.log(userLocation,siteId,workerId);
      const constructionSiteLocation: ILocation | { error: string } = await this.getLocationOfConstructionSite(siteId);
             
      if ('error' in constructionSiteLocation) {
        return { error: constructionSiteLocation.error };
      }    
          
      const { coordinates} = constructionSiteLocation;
             
      const isWithinRadius = await this.calculateDistanceAndCheckRadius(userLocation.latitude, userLocation.longitude, coordinates[0], coordinates[1], constructionSiteLocation.radius);

      if (isWithinRadius) {
        // If the location is within the radius, do check in & return a success message
        const checkIn = new CheckingModel({
          userType: "worker", 
          checkType: "check-in", 
          userId: workerId,
          constructionSiteId: siteId,
          timeStamp: new Date() 
        });     
        await checkIn.save();
        return { message: "check in successful" };
      } else {
        // If the location is outside the radius, return an error message
        return { message: "Location is too far from the construction site" };
      }
    } catch (error) {
            return {"error": error}
      }
  }

  async checkOutUser(location: Object, siteId: string, workerId: string): Promise<Object> {
    try {
      console.log(location,siteId,workerId);
      const constructionSiteLocation = await this.getLocationOfConstructionSite(siteId);
        
      return {"messsage": "check out succesful" };
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
    const actualRadius = radius.type.valueOf();         
    const dx = userLatitude - siteLatitude;
    const dy = userLongitude - siteLongitude;
    const distanceInKm = Math.sqrt(dx * dx + dy * dy);
      
    // Check if the distance is within the specified radius
    return distanceInKm <= actualRadius;
  }
      
      
}


export default GeoLocation;
