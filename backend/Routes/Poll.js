import express from 'express';
import Pusher from 'pusher';
import Vote from '../Model/voteModel.js';
import mongoose from 'mongoose';

const router = express.Router();

const pusher = new Pusher({
  appId: '1205567',
  key: '2b39e5d73074a49d5d0e',
  secret: '0338d0b8ab3af52cd5c6',
  cluster: 'mt1',
  useTLS: true,
});

router.get('/', async (req, res) => {
  const votes = await Vote.find();

  if (votes) {
    res.send(votes);
    //console.log(votes);
  } else {
    res.status(400);
    throw new Error('Not able to Fetch Data');
  }
});

router.post('/', async (req, res) => {
  const { food } = req.body;

  const newVote = await Vote.create({
    food,
    points: 1,
  });

  if (newVote) {
    pusher.trigger('Poll', 'vote', {
      food: newVote.food,
      points: Number(newVote.points),
    });
  } else {
    res.status(404);
    throw new Error('Invalid');
  }

  return res.json({ Success: true, message: 'Thank you for Voting' });
});

export default router;
