import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Pusher from 'pusher-js';

function App() {
  var voteCounts = {};
  const [burgerVote, setBurgerVote] = useState(voteCounts.Burger);
  const [pizzaVote, setPizzaVote] = useState(voteCounts.Pizza);
  const [voteClicked, setVoteClicked] = useState(false);

  const fetchVotes = async () => {
    try {
      const { data } = await axios.get('/poll');
      const totalVotes = data.length;

      voteCounts = data.reduce(
        (acc, vote) => (
          (acc[vote.food] = (acc[vote.food] || 0) + Number(vote.points)), acc
        ),
        {}
      );

      setBurgerVote(voteCounts.Burger);
      setPizzaVote(voteCounts.Pizza);
    } catch (error) {
      console.log(error);
    }
  };

  const [result, setResult] = useState({
    points: '',
    vote: '',
  });
  const [food, setFood] = useState('');

  Pusher.logToConsole = true;
  useEffect(() => {
    const pusher = new Pusher('2b39e5d73074a49d5d0e', { cluster: 'mt1' });
    const channel = pusher.subscribe('Poll');
    channel.bind('vote', (data) => {
      setResult({
        points: data.points,
        vote: data.vote,
      });
    });
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [result]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setVoteClicked(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post('/poll', { food }, config);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        {voteClicked ? (
          <div>
            {/* Burger:{burgerVote} Pizza:{pizzaVote} */}
            <Form.Group>
              <Form.Label>BURGER: </Form.Label>
              <Form.Text> {burgerVote}</Form.Text>
              {<br />}
              <Form.Label>PIZZA: </Form.Label>
              <Form.Text> {pizzaVote}</Form.Text>
            </Form.Group>
            <h4>Thanks For Voting</h4>
          </div>
        ) : (
          <Form id='Vote-Form' onSubmit={onSubmitHandler}>
            <h1 as={'h1'}>Vote For Your Favorite Food</h1>
            <Form.Group controlId='vote'>
              <Form.Check
                type='radio'
                name='group1'
                value='Pizza'
                label='Pizza'
                onChange={(e) => setFood(e.target.value)}
              ></Form.Check>
              <Form.Check
                type='radio'
                name='group1'
                value='Burger'
                label='Burger'
                onChange={(e) => setFood(e.target.value)}
              ></Form.Check>
            </Form.Group>
            <Button className='btn-block my-3' type='submit'>
              VOTE
            </Button>
          </Form>
        )}
      </Container>
    </>
  );
}

export default App;
