import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { axiosInitialParams } from '../../utills/utills'

axios.create(axiosInitialParams);
export default async function getUpcomingMatches(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await axios
    .get('https://unofficial-cricbuzz.p.rapidapi.com/matches/list', {
      params: { matchState: 'upcoming' },
    })
    .then((response) => {
      console.log(response.data)
    })

    return res;
}
