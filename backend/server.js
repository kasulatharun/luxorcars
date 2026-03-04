
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = '1234';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
fs.ensureDirSync('uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// In-memory car data store
let cars = [
    {
        id: 1,
        name: "Ferrari 296 GTB",
        brand: "Ferrari",
        price: 322986,
        image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=600",
        specs: {
            engine: "3.0L V6 Hybrid",
            horsepower: "830 HP",
            speed: "205 mph",
            acceleration: "2.9 sec",
            transmission: "8-Speed DCT"
        },
        category: "Italian",
        description: "The Ferrari 296 GTB marks a new chapter in Ferrari history."
    },
    {
        id: 2,
        name: "Lamborghini Huracan STO",
        brand: "Lamborghini",
        price: 327243,
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600",
        specs: {
            engine: "5.2L V10",
            horsepower: "631 HP",
            speed: "193 mph",
            acceleration: "3.0 sec",
            transmission: "7-Speed DCT"
        },
        category: "Italian",
        description: "The Huracan STO delivers unbridled performance."
    },
    {
        id: 3,
        name: "Ferrari Roma",
        brand: "Ferrari",
        price: 236930,
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600",
        specs: {
            engine: "3.9L V8 Twin-Turbo",
            horsepower: "611 HP",
            speed: "199 mph",
            acceleration: "3.4 sec",
            transmission: "8-Speed DCT"
        },
        category: "Italian",
        description: "Elegant supercar combining performance with everyday usability."
    },
    {
        id: 4,
        name: "Porsche 911 Turbo S",
        brand: "Porsche",
        price: 233800,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
        specs: {
            engine: "3.8L Twin-Turbo Flat-6",
            horsepower: "640 HP",
            speed: "205 mph",
            acceleration: "2.7 sec",
            transmission: "8-Speed PDK"
        },
        category: "German",
        description: "The pinnacle of Porsche engineering and performance."
    },
    {
        id: 5,
        name: "Lamborghini Aventador LP780-4",
        brand: "Lamborghini",
        price: 393350,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600",
        specs: {
            engine: "6.5L V12",
            horsepower: "769 HP",
            speed: "211 mph",
            acceleration: "2.8 sec",
            transmission: "7-Speed ISR"
        },
        category: "Italian",
        description: "The flagship V12 supercar from Lamborghini."
    },
    {
        id: 6,
        name: "Mercedes-AMG GT Black Series",
        brand: "Mercedes-Benz",
        price: 325000,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
        specs: {
            engine: "4.0L Twin-Turbo V8",
            horsepower: "730 HP",
            speed: "202 mph",
            acceleration: "3.1 sec",
            transmission: "7-Speed DCT"
        },
        category: "German",
        description: "The most powerful Mercedes-AMG production car ever."
    },
    {
        id: 7,
        name: "BMW M8 Competition",
        brand: "BMW",
        price: 143000,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
        specs: {
            engine: "4.4L Twin-Turbo V8",
            horsepower: "617 HP",
            speed: "190 mph",
            acceleration: "3.0 sec",
            transmission: "8-Speed Auto"
        },
        category: "German",
        description: "BMW's ultimate luxury sports coupe."
    },
    {
        id: 8,
        name: "Audi RS e-tron GT",
        brand: "Audi",
        price: 139900,
        image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600",
        specs: {
            engine: "Dual Motor Electric",
            horsepower: "637 HP",
            speed: "155 mph",
            acceleration: "2.9 sec",
            transmission: "2-Speed"
        },
        category: "German",
        description: "Audi's electric supercar."
    },
    {
        id: 9,
        name: "Ferrari SF90 Stradale",
        brand: "Ferrari",
        price: 507000,
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600",
        specs: {
            engine: "4.0L V8 Hybrid",
            horsepower: "986 HP",
            speed: "211 mph",
            acceleration: "2.5 sec",
            transmission: "8-Speed DCT"
        },
        category: "Italian",
        description: "Ferrari's first plug-in hybrid supercar."
    }
];

let appointments = [];

// API Routes

// GET all cars
app.get('/api/cars', (req, res) => {
    res.json(cars);
});

// GET single car
app.get('/api/cars/:id', (req, res) => {
    const car = cars.find(c => c.id == req.params.id);
    if (!car) {
        return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
});

// POST add new car (protected)
app.post('/api/cars', upload.single('image'), (req, res) => {
    const { password, name, brand, price, category, description, engine, horsepower, speed, acceleration, transmission, imageUrl } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized. Invalid password.' });
    }
    
    const newCar = {
        id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
        name: name || 'New Car',
        brand: brand || 'Unknown',
        price: parseInt(price) || 0,
        image: req.file ? `/uploads/${req.file.filename}` : (imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'),
        specs: {
            engine: engine || 'N/A',
            horsepower: horsepower || 'N/A',
            speed: speed || 'N/A',
            acceleration: acceleration || 'N/A',
            transmission: transmission || 'N/A'
        },
        category: category || 'Other',
        description: description || ''
    };
    
    cars.push(newCar);
    res.status(201).json({ message: 'Car added successfully', car: newCar });
});

// PUT update car (protected)
app.put('/api/cars/:id', upload.single('image'), (req, res) => {
    const { password, name, brand, price, category, description, engine, horsepower, speed, acceleration, transmission, imageUrl } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized. Invalid password.' });
    }
    
    const index = cars.findIndex(c => c.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Car not found' });
    }
    
    cars[index] = {
        ...cars[index],
        name: name || cars[index].name,
        brand: brand || cars[index].brand,
        price: parseInt(price) || cars[index].price,
        image: req.file ? `/uploads/${req.file.filename}` : (imageUrl || cars[index].image),
        specs: {
            engine: engine || cars[index].specs.engine,
            horsepower: horsepower || cars[index].specs.horsepower,
            speed: speed || cars[index].specs.speed,
            acceleration: acceleration || cars[index].specs.acceleration,
            transmission: transmission || cars[index].specs.transmission
        },
        category: category || cars[index].category,
        description: description || cars[index].description
    };
    
    res.json({ message: 'Car updated successfully', car: cars[index] });
});

// DELETE car (protected)
app.delete('/api/cars/:id', (req, res) => {
    const { password } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized. Invalid password.' });
    }
    
    const index = cars.findIndex(c => c.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Car not found' });
    }
    
    const deletedCar = cars.splice(index, 1)[0];
    res.json({ message: 'Car deleted successfully', car: deletedCar });
});

// POST upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ 
        message: 'Image uploaded successfully', 
        imageUrl: `/uploads/${req.file.filename}`,
        filename: req.file.filename
    });
});

// POST test drive
app.post('/api/test-drive', (req, res) => {
    const { name, phone, email, carId, date, time, message } = req.body;
    
    if (!name || !phone || !email || !carId || !date || !time) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    
    const appointment = {
        id: appointments.length + 1,
        name, phone, email,
        carId: parseInt(carId),
        date, time,
        message: message || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    res.status(201).json({ message: 'Test drive scheduled successfully', appointment });
});

// GET appointments (protected)
app.get('/api/appointments', (req, res) => {
    const { password } = req.query;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(appointments);
});

// POST contact
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    
    console.log('Contact form:', { name, email, subject, message });
    res.json({ message: 'Thank you for contacting us!' });
});

// Verify password
app.post('/api/verify', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Authenticated' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

console.log('Luxury Motors Backend API running on port', PORT);
app.listen(PORT);

