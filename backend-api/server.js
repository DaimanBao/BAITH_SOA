const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const helloRoutes = require('./routes/helloRoutes');

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Router
app.use('/api', authRoutes);
app.use('/api', helloRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});