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
      if (scorecard.status === 200)
        res.status(200).json(calculateScore(scorecard.data.scorecard))
      else res.status(scorecard.status).json(scorecard.statusText)
    })
    .catch((error) => {
      res.status(500)
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

  let res: any = {},
    idx = 0
  for (const item in scoresOfPlayers) {
    res[`player${idx}`] = { id: item, score: scoresOfPlayers[item] }
    idx++;
  }
  return res
}
