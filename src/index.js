import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './src/views');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(expressLayouts);
// app.set('layout', path.join(__dirname, 'views', 'layouts', 'layout.ejs'));
app.use(express.static(path.join(__dirname, '../Public')));

// Ruta de ejemplo 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});