export const corsOptions = {
    origin:["http://localhost:8081","*.vercel.app","https://www.ecocareer.app","https://ecocareer.app"],
    credentials:true,
    methods: ['GET,POST,PATCH,DELETE,OPTIONS'],
    allowedHeaders: ['Origin,X-Requested-With, Content-Type, Accept,Authorization'],
}