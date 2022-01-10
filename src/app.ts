import server from './server';

const port = 3333;

const starter = new server().start(port).then(port => console.log(`[APP] Server running on port ${port}`));

export default starter;
