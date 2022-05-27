// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { axiosInitialParams } from '../../utills/utills'

axios.defaults.baseURL = axiosInitialParams.baseUrl
axios.defaults.headers.common = axiosInitialParams.headers

export default async function getScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await axios
    .get('/matches/get-scorecard', {
      params: { matchId: req.query.matchId },
    })
    .then((scorecard) => {
      console.log(scorecard.statusText)
      if (scorecard.status === 200) {
        const response = {
          jobId: process.env.JOB_ID,
          data: calculateScore(scorecard.data.scorecard, req.query.contestId),
          status: 200,
        }
        res.status(200).json(response)
      } else {
        const response = {
          jobId: process.env.JOB_ID,
          error: 'Some Error Occured',
          status: scorecard.status,
        }
        res.status(scorecard.status).json(response)
      }
    })
    .catch((error) => {
      const response = {
        jobId: process.env.JOB_ID,
        error: error,
        status: 500,
      }
      res.status(500).json(response)
    })
}

const calculateScore = (scorecard: any, contestId: any) => {
  let scoresOfPlayers: any = {}
  scorecard.forEach((inning: any) => {
    inning.batsman.forEach((player: any, index: number) => {
      if (!scoresOfPlayers[player.id]) scoresOfPlayers[player.id] = 0
      scoresOfPlayers[player.id] +=
        (player.runs ?? 0) + (player.fours ?? 0) + (player.sixes ?? 0) * 2
      if (index < 8 && player.runs === 0) scoresOfPlayers[player.id] -= 2
    })

    inning.bowler.forEach((player: any) => {
      if (!scoresOfPlayers[player.id]) scoresOfPlayers[player.id] = 0
      scoresOfPlayers[player.id] += (player.wickets ?? 0) * 25
    })
  })

  let res: any = {
    'player-id': [parseInt(contestId)],
    scores: [parseInt(contestId)],
  }

  for (const item in scoresOfPlayers) {
    res['player-id'].push(parseInt(item))
    res['scores'].push(scoresOfPlayers[item])
  }

  return res
}
