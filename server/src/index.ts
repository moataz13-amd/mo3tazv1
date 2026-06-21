import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 PORTFOLIO API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`💻 ENVIRONMENT: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
});
