const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

// morgan.token('body', (request, response) => {
//   const body = request.body
//   return Object.keys(body).length > 0
//     ? JSON.stringify(body)
//     : ' '
// })

app.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ];

    const body = req.body;
    if (Object.keys(body).length > 0) {
      return log.concat(JSON.stringify(body)).join(' ');
    }

    return log.join(' ');
  })
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.post('/api/persons', (request, response) => {
  const name = request.body.name;
  if (!name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (persons.find((p) => p.name === name)) {
    return response.status(400).json({
      error: 'person with such name already exists',
    });
  }

  const number = request.body.number;
  if (!number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  const id = Math.round(Math.random() * 99999999999).toString();
  const person = { id, name, number };
  persons.push(person);
  response.json(person);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find((p) => p.id === request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter((p) => p.id !== request.params.id);
  response.status(204).end();
});

app.get('/info', (request, response) => {
  const html =
    `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${new Date()}</p>`;
  response.send(html);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(` - http://localhost:${PORT}/`);
});
