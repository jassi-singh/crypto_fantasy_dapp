// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { Axios, AxiosResponse } from 'axios'
axios.defaults.headers.common = {
  'X-RapidAPI-Host': 'unofficial-cricbuzz.p.rapidapi.com',
  'X-RapidAPI-Key': `${process.env.API_KEY}`,
}

export default async function getScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await axios
    .get('https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard', {
      params: { matchId: req.query.matchId },
    })
    .then((scorecard) => {
      console.log(scorecard.statusText)
      if (scorecard.status === 200) {
        const response = {
          jobId: 0,
          data: calculateScore(scorecard.data.scorecard),
          status: 200,
        }
        res.status(200).json(response)
      } else {
        const response = {
          jobId: 0,
          error: 'Some Error Occured',
          status: scorecard.status,
        }
        res.status(scorecard.status).json(response)
      }
    })
    .catch((error) => {
      const response = {
        jobId: 0,
        error: error,
        status: 500,
      }
      res.status(500).json(response)
    })
}

const calculateScore = (scorecard: any) => {
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
    'player-id': [],
    scores: [],
  }

  for (const item in scoresOfPlayers) {
    res['player-id'].push(item)
    res['scores'].push(scoresOfPlayers[item])
  }

  return res
}
