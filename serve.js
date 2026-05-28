const express = require('express');
const app = express();
app.use(express.static('F:\\暗区突围网站'));
app.listen(3456, () => console.log('http://localhost:3456/pages/review.html'));
