import ConstructionSiteModel from "../../models/constructionSite.model.js";
import { ILocation } from "../../shared/interfaces/location.interface";
import CheckingModel from "../../models/checks.model.js";
import {IChecking} from "../../shared/interfaces/checks.interface"
import {IError} from "../../shared/interfaces/error.interface";
import ApplicationError from "../../errors/applicationError.js";
class GeoLocation {
  
  //Check-In worker
  async checkInUser(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<{data:Object | null, error:IError|null}> {
    try {
      
      const constructionSiteResult = await this.getLocationOfConstructionSite(siteId);

      if (constructionSiteResult.error) {
        return {
          data: null,
          error: new ApplicationError(
            "Site not found",
            400,
            "Site not found",
            constructionSiteResult.error
          ),
        };
      }
      const constructionSiteLocation = constructionSiteResult.data;

      if (
        constructionSiteLocation &&
        constructionSiteLocation.radius !== undefined
      ) {
        const radius = constructionSiteLocation.radius; // Accessing the radius field
        console.log("construction site radius: " + radius);

        const { coordinates } = constructionSiteLocation;
        console.log("construction site coordinates: " + coordinates);
        const isWithinRadius = await this.calculateDistanceAndCheckRadius(
          userLocation.latitude,
          userLocation.longitude,
          coordinates[0],
          coordinates[1],
          constructionSiteLocation.radius
        );

        console.log("isWithinRadius: " + isWithinRadius);
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
            constructionSiteId: siteId,
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
              timeStamp: new Date(),
            });
            await checkIn.save();
          }
          return { data: { message: "check in successful" }, error: null };
        } else {
          // If the location is outside the radius
          return {
            data: { message: "Please be on site while check-in" },
            error: null,
          };
        }
      }
    } catch (error) {
            return {data:null, error:new ApplicationError('Something went wrong',400,'Something went wrong',error)}
      }
      return {data:null, error:new ApplicationError('Something went wrong',400,'Something went wrong','Something went wrong')}
  }

  //Check-Out worker
  async checkOutUser(siteId: string, workerId: string): Promise<{data:Object | null, error:IError|null}> {
    try {
      const workerData = await CheckingModel.findOne({
        userType: "worker",
        userId: workerId,
        constructionSiteId: siteId,
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
          timeStamp: new Date(),
        });
        await checkOut.save(); // Save the new document
      }

      return { data: { message: "check out successful" }, error: null };
    } catch (error) {
      return {
        data: null,
        error: new ApplicationError(
          "Something went wrong",
          400,
          "Something went wrong",
          error
        ),
      };
    }
  }

  //Get location of construction site
  async getLocationOfConstructionSite(siteId: string):  Promise<{data:ILocation | null, error:IError|null}> {
    try {      
      const constructionSite = await ConstructionSiteModel.findOne({ companyId: siteId });

      if (!constructionSite) {
        return {
          data: null,
          error: new ApplicationError(
            "Construction site not found",
            400,
            "Construction site not found",
            "Construction site not found"
          ),
        };
      }
      const siteLocation = constructionSite.siteLocation as ILocation;
      return { data: siteLocation, error: null };
    } catch (error) {
      return {
        data: null,
        error: new ApplicationError(
          "Something went wrong",
          400,
          "Something went wrong",
          error
        ),
      };
    }
  }

  async calculateDistanceAndCheckRadius(
    userLatitude: number,
    userLongitude: number,
    siteLatitude: number,
    siteLongitude: number,
    radius: { type: Number }
  ): Promise<boolean> {
    // Convert radius in meters to kilometers;
    const actualRadius = Number(radius) / 1000;
    console.log("radius: " + actualRadius);
    console.log("userLatitude: " + userLatitude);
    console.log("userLongitude: " + userLongitude);
    console.log("siteLatitude: " + siteLatitude);
    console.log("siteLongitude: " + siteLongitude);
    const earthRadius: number = 6371; // Earth's radius in kilometers
    const deg2rad: (deg: number) => number = (deg: number) =>
      deg * (Math.PI / 180);

    // Convert latitude and longitude from degrees to radians
    const userLatRad: number = deg2rad(userLatitude);
    const userLonRad: number = deg2rad(userLongitude);
    const siteLatRad: number = deg2rad(siteLatitude);
    const siteLonRad: number = deg2rad(siteLongitude);

    // Haversine formula
    const dLat: number = siteLatRad - userLatRad;
    const dLon: number = siteLonRad - userLonRad;
    const a: number =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLatRad) *
        Math.cos(siteLatRad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm: number = earthRadius * c;

    console.log("Actual Radius>>> " + actualRadius);
    console.log("difference>>> " + distanceInKm);

    // Check if the distance is within the specified radius
    return distanceInKm <= actualRadius;
  }

 // Get the safe zone of construction site
  async getSafeZoneOfConstructionSite(siteId: string):  Promise<{data:ILocation | null, error:IError|null}> {
    try {
      const constructionSite = await ConstructionSiteModel.findOne({
        companyId: siteId,
      });

      if (!constructionSite) {
        return {
          data: null,
          error: new ApplicationError(
            "Construction site not found",
            400,
            "Construction site not found",
            "Construction site not found"
          ),
        };
      }

      const safeZoneLocation = constructionSite.safeZoneLocation as ILocation;
      return { data: safeZoneLocation, error: null };
    } catch (error) {
      return {
        data: null,
        error: new ApplicationError(
          "Something went wrong",
          400,
          "Something went wrong",
          error
        ),
      };
    }
  }

  //To check if worker is in safe zone.
  async checkIfUserInSafeZone(
    userLocation: { latitude: number; longitude: number },
    siteId: string,
    workerId: string
  ): Promise<{ data: Object | null; error: IError | null }> {
    try {
      const safeZoneResult = await this.getSafeZoneOfConstructionSite(siteId);

      if (safeZoneResult.error) {
        return {
          data: null,
          error: new ApplicationError(
            "Site not found",
            400,
            "Site not found",
            safeZoneResult.error
          ),
        };
      }
      const safeZoneLocation = safeZoneResult.data;

      if (safeZoneLocation && safeZoneLocation.radius !== undefined) {
        const radius = safeZoneLocation.radius; // Accessing the radius field
        console.log("safeZoneLocation radius: " + radius);

        const { coordinates } = safeZoneLocation;
        console.log("safeZoneLocation coordinates: " + coordinates);
        const isWithinRadius = await this.calculateDistanceAndCheckRadius(
          userLocation.latitude,
          userLocation.longitude,
          coordinates[0],
          coordinates[1],
          safeZoneLocation.radius
        );

        console.log("isWithinRadius: " + isWithinRadius);

        if (isWithinRadius) {
          return { data: { message: "Worker is in safe zone" }, error: null };
        } else {
          return {
            data: { message: "Worker is not in safe zone" },
            error: null,
          };
        }
      }
    } catch (error) {
      return {
        data: null,
        error: new ApplicationError(
          "Something went wrong",
          400,
          "Something went wrong",
          error
        ),
      };
    }
    return {data:null, error:new ApplicationError('Something went wrong',400,'Something went wrong','Something went wrong')}
  }   

  //Get checked-in workers of construction site
  async getWorkersCheckedIn(siteId: string): Promise<{ data: IChecking[] | null, error: IError | null }> {
    try {
      const workersCheckedIn = await CheckingModel.find({ constructionSiteId: siteId }).lean().exec();
  
      if (!workersCheckedIn || workersCheckedIn.length === 0) {
        return { data: null, error: new ApplicationError('Data unavailable', 400, 'Data unavailable', 'Data unavailable') };
      }          
      return { data: workersCheckedIn as IChecking[], error: null };
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }
}




export default GeoLocation;
