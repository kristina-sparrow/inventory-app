import cors from "cors";

const allowedOrigins = ["https://inventoryapp-ks.onrender.com"];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
