const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('express-async-errors');
const {connectDb} = require('./config/db');
const authRoutes = require('./API/routes/auth.route');
const customerRoutes = require('./API/routes/customer.route');
const campaignRoutes = require('./API/routes/campaign.route');
const segmentRoutes = require('./API/routes/segment.route');
const messageRoutes = require('./API/routes/message.route');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config({ path: __dirname + '/.env' });
const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

const authMiddleware = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/campaigns', authMiddleware, campaignRoutes);
app.use('/api/segments', authMiddleware, segmentRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
  console.log("server is running on ort " + PORT);  
})
