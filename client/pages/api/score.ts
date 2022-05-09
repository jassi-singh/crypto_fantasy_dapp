// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
axios.defaults.headers.common = {
  'X-RapidAPI-Host': 'unofficial-cricbuzz.p.rapidapi.com',
  'X-RapidAPI-Key': 'aac0b27d35mshf2c0872bb6b1a79p154255jsnbd7c6fd0611f',
}

type Data = {
  score: number
}

export default async function getScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scorecard = await axios.get(
    'https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard',
    { params: { matchId: req.body.matchId } }
  )
  res.status(200).json(calculateScore(scorecard.data.scorecard))
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
  return scoresOfPlayers
}
