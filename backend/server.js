const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('express-async-errors');
const connectDb = require('./config/db');
const authRoutes = require('./routes/auth.route');
const customerRoutes = require('./routes/customer.route');
const campaignRoutes = require('./routes/campaign.route');
const segmentRoutes = require('./routes/segment.route');
const messageRoutes = require('./routes/message.route');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/messages', messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDb()
  .then(() => app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)))
  .catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
