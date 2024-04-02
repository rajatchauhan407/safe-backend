import ConstructionSiteModel from "../../models/constructionSite.model.js";
import { ILocation } from "../../shared/interfaces/location.interface";
import CheckingModel from "../../models/checks.model.js";
import SafeZoneWorkerModel from "../../models/safezoneworkers.model.js"
import User from '../../models/user.model.js'
import {IChecking} from "../../shared/interfaces/checks.interface"
import {ISafeZoneWorkers} from "../..//shared/interfaces/safezone.interface.js"
import {IConstructionSite} from "../../shared/interfaces/constructionSite.interface"
import {IError} from "../../shared/interfaces/error.interface";
import {IUser} from "../../shared/interfaces/user.interface"
import ApplicationError from "../../errors/applicationError.js";
import {Server as SocketIOServer} from 'socket.io';

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
          radius
        );

        console.log("isWithinRadius: " + isWithinRadius);
     
        if (isWithinRadius) {
          // If the location is within the radius, do check in & return a success message
          // Check if worker data exists
          const workerData = await CheckingModel.findOne({
            userType: "worker",
            userId: workerId,
            constructionSiteId: siteId,
          });
          let currentDate = new Date();
          if (workerData) {
            // If worker data exists, update checkType and timeStamp
            workerData.checkType = "check-in";
            workerData.timeStamp = currentDate;
            await workerData.save();
          } else {
            // If worker data doesn't exist, insert new data
           
            const checkIn = new CheckingModel({
              userType: "worker",
              checkType: "check-in",
              userId: workerId,
              constructionSiteId: siteId,
              timeStamp: currentDate,
            });
            await checkIn.save();
          }
          return { data: { message: "check in successful",time: currentDate}, error: null };
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

      // Remove worker data from SafeZoneWorkerModel
      await SafeZoneWorkerModel.deleteOne({
      userType: "worker",
      userId: workerId,
      constructionSiteId: siteId,
      });
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
      const constructionSite = await ConstructionSiteModel.findOne({ _id: siteId });

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
        _id: siteId,
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
      const workersCheckedIn = await CheckingModel.find({ constructionSiteId: siteId, checkType: "check-in" }).lean().exec();
  
      if (!workersCheckedIn || workersCheckedIn.length === 0) {
        return { data: null, error: new ApplicationError('Data unavailable', 400, 'Data unavailable', 'Data unavailable') };
      }          
      return { data: workersCheckedIn as IChecking[], error: null };
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }

  //Get workers data of construction site
    async getWorkersData(siteId: string): Promise<{ data: { workersData: IUser[], workersCheckedIn: IChecking[] } | null, error: IError | null }> {
    try {
      console.log("Site ID from frontend: "+siteId);
      const constructionSite = await ConstructionSiteModel.findOne({ _id: siteId });  
      if (!constructionSite) {
        return { data: null, error: new ApplicationError('Construction site not found', 400, 'Construction site not found', 'Construction site not found') };
      } 
       console.log("Construction site workers>> "+constructionSite.workers?.length)
      if (!constructionSite.workers) {
        console.log("comes here")
        return { data: { workersData: [], workersCheckedIn: [] }, error: null }; // If workers array is undefined, return empty data
      }         
      const checkedInWorkersResponse = await this.getWorkersCheckedIn(siteId);
        const checkedInWorkers = checkedInWorkersResponse.data || [];

        console.log(checkedInWorkers)

      // Collect user details along with their jobPosition
      const userDataPromises = constructionSite.workers.map(async (worker: IUser) => {
        try {
          // Find the user by ID
          const user = await User.findOne({ _id: worker._id }).exec();
          return user;
        } catch (error) {
          // Handle errors if user is not found or any other error occurs
          console.error(`Error fetching user details: ${error}`);
          return { data: null, error: new ApplicationError('Error fetching user details', 400, 'Error fetching user details', error) };
        }
      });

      const userData = await Promise.all(userDataPromises); 
     
      return { data: {workersData: userData.filter(user => user) as IUser[], workersCheckedIn: checkedInWorkers}, error: null };      
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }

   //Get check-in/check-out status of worker
   async getCheckedStatus(workerId: string): Promise<{ data: IChecking[] | null, error: IError | null }> {
    try {
      const workerStatus = await CheckingModel.find({ userId: workerId}).lean().exec();
  
      if (!workerStatus || workerStatus.length === 0) {
        return { data: null, error: new ApplicationError('Data unavailable', 400, 'Data unavailable', 'Data unavailable') };
      }          
      return { data: workerStatus as IChecking[], error: null };
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }

  //Get safezone workers of construction site
  async getSafeZoneWorkers(siteId: string): Promise<{ data: ISafeZoneWorkers[] | null, error: IError | null }> {
    try {
      const workersInSafeZone = await SafeZoneWorkerModel.find({ constructionSiteId: siteId }).lean().exec();
  
      if (!workersInSafeZone || workersInSafeZone.length === 0) {
        return { data: null, error: new ApplicationError('Data unavailable', 400, 'Data unavailable', 'Data unavailable') };
      }          
      return { data: workersInSafeZone as ISafeZoneWorkers[], error: null };
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }

  async getWorkersinSafeZoneData(siteId: string): Promise<{ data: { workersData: IUser[], safeZoneWorkers: ISafeZoneWorkers[] } | null, error: IError | null }> {
    try {
      console.log("Site ID from frontend: "+siteId);
      const constructionSite = await ConstructionSiteModel.findOne({ _id: siteId });  
      if (!constructionSite) {
        return { data: null, error: new ApplicationError('Construction site not found', 400, 'Construction site not found', 'Construction site not found') };
      } 
       console.log("Construction site workers>> "+constructionSite.workers?.length)
      if (!constructionSite.workers) {
        console.log("comes here")
        return { data: { workersData: [], safeZoneWorkers: [] }, error: null }; // If workers array is undefined, return empty data
      }         
      const safeZoneWorkersResponse = await this.getSafeZoneWorkers(siteId);
        const safeZoneWorkers = safeZoneWorkersResponse.data || [];

        console.log(safeZoneWorkers)

      // Collect user details along with their jobPosition
      const userDataPromises = constructionSite.workers.map(async (worker: IUser) => {
        try {
          // Find the user by ID
          const user = await User.findOne({ _id: worker._id }).exec();
          return user;
        } catch (error) {
          // Handle errors if user is not found or any other error occurs
          console.error(`Error fetching user details: ${error}`);
          return { data: null, error: new ApplicationError('Error fetching user details', 400, 'Error fetching user details', error) };
        }
      });

      const userData = await Promise.all(userDataPromises); 
     
      return { data: {workersData: userData.filter(user => user) as IUser[], safeZoneWorkers: safeZoneWorkers}, error: null };      
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }

  //Create safezone worker
  async createSafeZoneWorker(siteId: string, workerId: string): Promise<{data:Object | null, error:IError|null}> {
    try {
      
      const existingSafeZoneWorker = await SafeZoneWorkerModel.findOne({
        userType: "worker",
        userId: workerId,
        constructionSiteId: siteId,
      });
      let currentDate = new Date();
      if (existingSafeZoneWorker) {
        // If worker data exists, update checkType and timeStamp
        existingSafeZoneWorker.timeStamp = currentDate;
        await existingSafeZoneWorker.save();
      } else {
        // If worker data doesn't exist, insert new data
        const safeZoneWorker = new SafeZoneWorkerModel({
          userType: "worker",
          userId: workerId,
          constructionSiteId: siteId,
          timeStamp: new Date(),
        });
        await safeZoneWorker.save(); 
      }
      return { data: { message: "Safe Zone Worker Created" }, error: null };
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

}




export default GeoLocation;
