const express = require('express')
 const cors = require('cors');
const app = express()
const port = process.env.PORT ||5000



// middle Ware 
app.use(cors());
app.use(express.json())







app.get('/', (req, res) => {
  res.send('Book Crafter Server is runnng')
})

app.listen(port, () => {
  console.log(`Book Crafter Server is runnng on port ${port}`)
})
