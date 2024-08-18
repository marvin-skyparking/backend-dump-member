// src/index.ts
import app from './app';
import 'reflect-metadata';
import EnvConfig from './config/envConfig';


const PORT = EnvConfig.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
