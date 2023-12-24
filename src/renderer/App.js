import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
const { Client } = require("pg");

const pgClient = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "postgres",
  port: 15432,
});


export default function App() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
        Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}

function pgTest001(){
  // pgClient.connect();
  // pgClient.query("SELECT NOW()", (err, res) => {
  //   console.log(err, res);
  //   pgClient.end();
  // });
  pgClient.connect();
  const query = {
    text: "SELECT * FROM newtable",
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      pgClient
        .query(query)
        .then((res) => {
          console.log(res.rows[0]);
          pgClient.end();
          resolve();
        })
        .catch((e) => {
          console.error(e.stack);
          reject();
        });
    }, 1500);
  });
}