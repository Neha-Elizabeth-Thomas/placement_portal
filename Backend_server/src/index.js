import express from "express";
import cors from "cors"
import StudentRoutes from "./routes/StudentRoutes.js"
import DriveRoutes from "./routes/DriveRoutes.js"
import CompanyRoutes from "./routes/CompanyRoutes.js"
import driveRegistrationRoutes from "./routes/driveRegistrationRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import regRoutes from "./routes/registrationRoutes.js"
import roundsRoutes from "./routes/RoundsRoutes.js"
import resultRoutes from "./routes/ResultRoutes.js"
import studDashboardRoutes from "./routes/StudDashboardRoutes.js"
import studFilterRoutes from "./routes/FilterRoutes.js"
import otpRoutes from "./routes/otpRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"

//import StudentRoutes from "./routes/StudentRoutes.js"
const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'https://placement-app-iota.vercel.app', // Production frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If using cookies/auth tokens
}));
app.use(express.json());
app.use('/portal', StudentRoutes);
app.use('/portal', DriveRoutes);
app.use('/portal', CompanyRoutes);
app.use('/portal', driveRegistrationRoutes);
app.use('/portal', authRoutes);
app.use('/portal', regRoutes);
app.use('/portal', roundsRoutes);
app.use('/portal', resultRoutes);
app.use('/portal', studDashboardRoutes);
app.use('/portal', studFilterRoutes);
app.use('/portal', otpRoutes);
app.use('/portal', chatRoutes);

app.listen(port, () => {
    console.log(`Its listening at port ${port}`);
});
