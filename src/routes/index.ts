import { Router } from 'express';
import autoRoutes from '../features/autos/routes';


const router = Router();

router.use('/autos', autoRoutes);


export default router; 