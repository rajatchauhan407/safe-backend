import ConstructionSite from "../../models/constructionSite.model.js";
class GeoLocation {

    async checkInUser(location: Object, siteId: String, workerId: String): Promise<Object> {
        try {
            console.log(location,siteId,workerId);
            const constructionSiteLocation = await this.getLocationOfConstructionSite(siteId);
          
            return {"messsage": "check in succesful" };
          } catch (error) {
            return {"error": error}
          }
    }

    async getLocationOfConstructionSite(siteId: String): Promise<Object> {
        try {
            const location = await ConstructionSite.find({
                companyId: siteId
            });
            return location;
          } catch (error) {
            return {"error": error}
          }
        }
    }


export default GeoLocation;
