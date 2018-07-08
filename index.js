const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const Pack = require('./package');
const schema = require('./graphql/schema');

const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

mongoose.connect('mongodb://user2:letmein2018@ds129051.mlab.com:29051/my-api');

mongoose.connection.once('open', () => {
	console.log('Connected to DB server successfuly');
});


const init = async () => {

	const swaggerOptions = {
        info: {
                title: 'Documentation about API for Painting ',
                version: Pack.version,
            },
        };
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}

	});
	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}

		}
	});
	server.route([
		{
			method: 'GET',
			path: '/',
			handler: function (request, reply) {
				return '<h1>Мой супер API</h1>';
			}
		},
		{
			method: 'GET',
			path: '/api/v1/paintings',
			config: {
				description: 'Get Painting',
				tags: ['api', 'v1', 'someone-tag']
			},
			handler: (req, reply) => {
				return Painting.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/paintings',
			config: {
				description: 'Add new Painting',
				tags: ['api', 'painting']
			},
			handler: (req, reply) => {
				const { name, url, techniques } = req.payload;
				const painting = new Painting({
					name,
					url,
					techniques
				});
			return painting.save();
			}
		}
		]);
	await server.start();
	console.log(`Server run at: ${server.info.uri}`);
};

init();