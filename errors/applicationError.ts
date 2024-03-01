import {IError} from "../shared/interfaces/error.interface"; 
class ApplicationError extends Error implements IError{
    public statusCode: number;
    public error: string;
    public details: any;
    constructor(message:string, statusCode:number, error:string,details:any){
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;
    }
}

export default ApplicationError;