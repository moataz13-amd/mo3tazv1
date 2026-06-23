import serverlessHttp from 'serverless-http';
import app from '../../api/index.js';

const wrapped = serverlessHttp(app, {
  binary: ['multipart/form-data'],
  request: (request, _event) => {
    if (request.url.startsWith('/.netlify/functions/api')) {
      request.url = request.url.replace('/.netlify/functions/api', '');
      if (!request.url) request.url = '/';
    }
  },
});

export const handler = async (event: any, context: any) => {
  return await wrapped(event, context);
};
